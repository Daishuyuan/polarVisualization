package com.shou.polar.service;

import com.google.gson.Gson;

import com.google.gson.JsonArray;
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

@Service
public class TargetPathScheduledTaskService {
    private static SimpleDateFormat SDF = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    private static Map<String, DataProcessor> PROCESSORS;
    private static Logger logger = Logger.getLogger(TargetPathScheduledTaskService.class);
    private static Gson GSON = null;
    private JsonArray configs = null;

    @Autowired
    public TargetPathScheduledTaskService() {
        GSON = new Gson();
        PROCESSORS = Collections.synchronizedMap(new HashMap<>());
    }

    private void saveConfig(File configFile) throws IOException {
        FileUtils.writeStringToFile(configFile, configs.toString(), StandardCharsets.UTF_8); // 写回配置
    }

    public void configAndRun() {
        try {
            File configFile = ResourceUtils.getFile(PolarCts.UPDATE_DATA_CONFIG_FILE_PATH);
            String configStr = FileUtils.readFileToString(configFile, StandardCharsets.UTF_8); // 读取文件内容
            JsonArray configs = GSON.fromJson(configStr, JsonArray.class); // 转换成Json数组格式
            for(int i=0; i < configs.size(); ++i) {
                ConfigEntity configEntity = GSON.fromJson(configs.get(i), ConfigEntity.class);
                Class<DataProcessor> processorClass = (Class<DataProcessor>) Class.forName(configEntity.getEntityClass());
                DataProcessor processor = processorClass.getConstructor().newInstance();
                processor.setConfigEntity(configEntity);
                PROCESSORS.put(configEntity.getName(), processor);
                if (StringUtils.isEmpty(configEntity.getCycleTimeRecord())) {
                    configEntity.setCycleTimeRecord(String.valueOf(new Date().getTime()));
                }
                configs.set(i, GSON.toJsonTree(configEntity, ConfigEntity.class));
            }
            this.configs = configs;
            saveConfig(configFile);
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

    @Async
    public void executeProcess(DataProcessor processor) {
        processor.execute();
    }

    @Scheduled(fixedRate = PolarCts.SCHEDULE_CYCLE)
    public void processDataByCycle() {
        if (null != this.configs) {
            long wakeTime = new Date().getTime(); // 获取当前时间
            for (int i=0; i < this.configs.size(); ++i) {
                ConfigEntity configEntity = GSON.fromJson(this.configs.get(i), ConfigEntity.class);
                long UDCTime = Long.parseLong(configEntity.getCycleTimeRecord()); // 上一次更新日期
                long UDC = configEntity.getScheduledCycle(); // 更新间隔
                if (UDCTime - wakeTime >= UDC) { // 间隔时间大于更新间隔
                    long nextTime = UDCTime + UDC;
                    configEntity.setCycleTimeRecord(String.valueOf(nextTime)); // 刷新更新日期
                    DataProcessor processor = PROCESSORS.get(configEntity.getName());
                    executeProcess(processor); // 异步执行
                    ConfigEntity entity = processor.getConfigEntity();
                    logger.info(entity.getName() + ", " + entity.getDescription() + ", " + SDF.format(new Date(wakeTime)));
                }
                this.configs.set(i, GSON.toJsonTree(configEntity, ConfigEntity.class));
            }
            try {
                saveConfig(ResourceUtils.getFile(PolarCts.UPDATE_DATA_CONFIG_FILE_PATH));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
