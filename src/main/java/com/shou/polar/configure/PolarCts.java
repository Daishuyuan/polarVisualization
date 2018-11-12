package com.shou.polar.configure;

import org.jboss.logging.Logger;
import org.springframework.util.ResourceUtils;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Arrays;
import java.util.List;

public final class PolarCts {
    private static final Logger logger = Logger.getLogger(PolarCts.class);
    // basic common properties
    public static final long SCHEDULE_CYCLE = 500000;
//    public static final long DEFAULT_ERROR_CYCLE_TIME = (long)(SCHEDULE_CYCLE * 1.618);
    public static final String PATH_SPLIT = "/";
    public static final String PERIOD_SPLIT = ".";
    public static final String JSON_SUFFIX = ".json";
    public static final String LOCAL_RES_PATH = "classpath:local";
    public static final String SCENES_RES_PATH = LOCAL_RES_PATH + "/scenes";
    public static final String DIAGRAMS_RES_PATH = LOCAL_RES_PATH + "/diagrams";
    public static final String CONFIG_RES_PATH = LOCAL_RES_PATH + "/config";
    public static final String DISPLAY_RES_PATH = LOCAL_RES_PATH + "/data/target";
    public static final String SOURCE_RES_PATH = LOCAL_RES_PATH + "/data/source";
    public static final String UPDATE_DATA_CONFIG_FILE_PATH = CONFIG_RES_PATH + "/DataUpdateCycleConfig.json";

    static {
        try {
            File root = ResourceUtils.getFile("classpath:");
            String absolutePath = root.getAbsolutePath().intern();
            List<String> checkList = Arrays.asList(
                    absolutePath + "\\local",
                    absolutePath + "\\local\\config",
                    absolutePath + "\\local\\diagrams",
                    absolutePath + "\\local\\scenes",
                    absolutePath + "\\local\\data",
                    absolutePath + "\\local\\data\\target",
                    absolutePath + "\\local\\data\\source");
            for (String checkPath: checkList) {
                File checkFile = new File(checkPath);
                if (!checkFile.exists() && !checkFile.mkdir()) {
                    throw new RuntimeException("can't generate target file: " + checkPath);
                }
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
            logger.error(e);
        }
    }
}
