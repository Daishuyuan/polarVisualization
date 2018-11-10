package com.shou.polar.service;

import com.google.gson.Gson;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.shou.polar.configure.PolarCts;
import com.shou.polar.pojo.ConfigEntity;
import com.shou.polar.pojo.DataProcessor;
import org.apache.commons.io.FileUtils;
import org.jboss.logging.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;
import org.springframework.util.StringUtils;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * TargetPathScheduledTaskService
 * 按照一定的周期调用指定的数据处理器
 *
 * @author dsy 2018/11/08
 */
@Service
public class TargetPathScheduledTaskService {
    private static SimpleDateFormat SDF = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    private static Map<String, DataProcessor> PROCESSORS;
    private static Logger logger = Logger.getLogger(TargetPathScheduledTaskService.class);
    private static Gson GSON = null;
    private AtomicBoolean isInit;

    @Autowired
    public TargetPathScheduledTaskService() {
        GSON = new Gson();
        isInit = new AtomicBoolean(false);
        PROCESSORS = Collections.synchronizedMap(new HashMap<>());
    }

    private void saveConfig(final File configFile, final JsonElement configs) throws IOException {
        FileUtils.writeStringToFile(configFile, configs.toString(), StandardCharsets.UTF_8); // 写回配置
    }

    /**
     * 按照配置文件配置运行数据处理器
     * @author dsy 2018/11/08
     */
    public void configAndRun() {
        try {
            File configFile = ResourceUtils.getFile(PolarCts.UPDATE_DATA_CONFIG_FILE_PATH);
            String configStr = FileUtils.readFileToString(configFile, StandardCharsets.UTF_8); // 读取文件内容
            JsonArray configs = GSON.fromJson(configStr, JsonArray.class); // 转换成Json数组格式
            for(int i=0; i < configs.size(); ++i) {
                ConfigEntity configEntity = GSON.fromJson(configs.get(i), ConfigEntity.class);
                Class<DataProcessor> processorClass = (Class<DataProcessor>) Class.forName(configEntity.getEntityClass());
                DataProcessor processor = processorClass.getConstructor().newInstance();
                processor.setConfigEntity(configEntity); // 设置配置实体
                PROCESSORS.put(configEntity.getName(), processor);
                if (StringUtils.isEmpty(configEntity.getCycleTimeRecord())) {
                    configEntity.setCycleTimeRecord(String.valueOf(new Date().getTime())); // 设置初始化调用时间
                }
                if(configEntity.isStartInInit()) {
                    executeProcess(processor);  // 初始化时，异步触发处理器
                }
                configs.set(i, GSON.toJsonTree(configEntity, ConfigEntity.class));
            }
            saveConfig(configFile, configs); // 写回配置
            isInit.set(true);
        } catch (IOException |
                InstantiationException |
                NoSuchMethodException |
                InvocationTargetException |
                IllegalAccessException |
                ClassNotFoundException e) {
            e.printStackTrace();
            logger.error(e);
        }
    }

    /**
     * 异步执行数据处理器（在配置线程池中运行）
     *
     * @param processor 数据处理器
     */
    @Async
    public void executeProcess(DataProcessor processor) {
        processor.execute();
    }

    /**
     * 按照 SCHEDULE_CYCLE 的周期调用调度器
     */
    @Scheduled(fixedRate = PolarCts.SCHEDULE_CYCLE)
    public void processDataByCycle() {
        try {
            if (isInit.get()) {
                File configFile = ResourceUtils.getFile(PolarCts.UPDATE_DATA_CONFIG_FILE_PATH);
                String configStr = FileUtils.readFileToString(configFile, StandardCharsets.UTF_8); // 读取文件内容
                JsonArray configs = GSON.fromJson(configStr, JsonArray.class); // 转换成Json数组格式
                long wakeTime = new Date().getTime(); // 获取当前时间
                for (int i=0; i < configs.size(); ++i) {
                    ConfigEntity configEntity = GSON.fromJson(configs.get(i), ConfigEntity.class);
                    long UDCTime = Long.parseLong(configEntity.getCycleTimeRecord()); // 上一次更新日期
                    long UDC = configEntity.getScheduledCycle(); // 更新间隔
                    if (Math.abs(wakeTime - UDCTime) >= UDC) { // 间隔时间大于更新间隔
                        long nextTime = UDCTime + UDC;
                        configEntity.setCycleTimeRecord(String.valueOf(nextTime)); // 刷新更新日期
                        DataProcessor processor = PROCESSORS.get(configEntity.getName());
                        executeProcess(processor); // 异步执行
                        logger.info(configEntity.getDescription() + "," + SDF.format(new Date(wakeTime)));
                    }
                    configs.set(i, GSON.toJsonTree(configEntity, ConfigEntity.class)); // 写回配置
                }
                saveConfig(configFile, configs);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
