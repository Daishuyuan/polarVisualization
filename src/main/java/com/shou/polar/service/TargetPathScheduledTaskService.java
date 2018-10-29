package com.shou.polar.service;

import com.google.gson.Gson;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.shou.polar.configure.PolarCts;
import com.shou.polar.process.DataProcessor;
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
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class TargetPathScheduledTaskService {
    private static final String TIME_STAMP = "CYCLE_TIME_STAMP";
    private static final StringBuilder BUILDER = new StringBuilder();
    private static SimpleDateFormat SDF = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    private static List<DataProcessor> PROCESSORS;
    private static Logger logger = Logger.getLogger(TargetPathScheduledTaskService.class);
    private static Gson GSON;

    @Autowired
    public TargetPathScheduledTaskService() {
        GSON = new Gson();
        PROCESSORS = Collections.synchronizedList(new ArrayList<>());
    }

    public static void addTaskSchedule(DataProcessor processor) {
        if (processor != null) {
            PROCESSORS.add(processor);
        }
    }

    public static void configAndRun() {
        try {
            File configFile = ResourceUtils.getFile(PolarCts.UPDATE_DATA_CONFIG_FILE_PATH);
            String configStr = FileUtils.readFileToString(configFile, StandardCharsets.UTF_8); // 读取文件内容
            JsonObject config = GSON.fromJson(configStr, JsonObject.class); // 转换成Json对象格式
            for (DataProcessor processor : PROCESSORS) {
                if (StringUtils.isEmpty(config.get(processor.getConfigName()))) {
                    config.addProperty(processor.getConfigName(), PolarCts.DEFAULT_ERROR_CYCLE_TIME);
                    String configPath = PolarCts.UPDATE_DATA_CONFIG_FILE_PATH;
                    String configName = processor.getConfigName();
                    String configType = processor.getClass().getName();
                    logger.error(configPath + " don't exist the name: " + configName + " of class: " + configType);
                }
            }
            FileUtils.writeStringToFile(configFile, GSON.toJson(config), StandardCharsets.UTF_8); // 写回配置
        } catch (IOException e) {
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
        try {
            BUILDER.delete(0, BUILDER.length());
            BUILDER.append(SDF.format(new Date())).append(" processDataByCycle executing;");
            File configFile = ResourceUtils.getFile(PolarCts.UPDATE_DATA_CONFIG_FILE_PATH); // 读取配置文件
            String configStr = FileUtils.readFileToString(configFile, StandardCharsets.UTF_8); // 读取文件内容
            JsonObject config = GSON.fromJson(configStr, JsonObject.class); // 转换成Json对象格式
            if (!StringUtils.isEmpty(config)) {
                long wakeTime = new Date().getTime(); // 获取当前时间
                if (!PROCESSORS.isEmpty()) BUILDER.append("\n");
                for (DataProcessor processor : PROCESSORS) {
                    final String processorName = processor.getConfigName(); // 获取配置名称
                    final String processorTimeName = processorName + "_" + TIME_STAMP; // 获取数据更新日期名称
                    JsonElement UDCElement = config.get(processorName); // 获取数据更新周期
                    JsonElement UDCTimeElement = config.get(processorTimeName); // 获取上一次的更新日期
                    if (!StringUtils.isEmpty(UDCElement)) {
                        if (!StringUtils.isEmpty(UDCTimeElement)) {
                            long UDCTime = Long.parseLong(UDCTimeElement.getAsString()); // 上一次更新日期
                            long UDC = Long.parseLong(UDCElement.getAsString()); // 更新间隔
                            if (UDCTime - wakeTime >= UDC) { // 间隔时间大于更新间隔
                                BUILDER.append(processor.getClass().getSimpleName()).append("-");
                                BUILDER.append(SDF.format(new Date(wakeTime))).append("\n");
                                config.addProperty(processorTimeName, wakeTime); // 刷新更新日期
                                executeProcess(processor); // 异步执行
                            }
                        } else {
                            config.addProperty(processorTimeName, wakeTime); // 创建更新日期
                        }
                    } else {
                        throw new RuntimeException(processor.getClass().getName() + " could not be valid.");
                    }
                }
                logger.info(BUILDER.toString()); // 日志刷新
                FileUtils.writeStringToFile(configFile, GSON.toJson(config), StandardCharsets.UTF_8); // 写回配置
            } else {
                throw new RuntimeException("update data configuration isn't exist.");
            }
        } catch (IOException ioe) {
            ioe.printStackTrace();
            logger.error(ioe);
        }
    }
}
