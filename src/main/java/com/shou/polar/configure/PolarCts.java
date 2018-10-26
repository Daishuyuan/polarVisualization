package com.shou.polar.configure;

public final class PolarCts {
    // basic common properties
    public static final long SCHEDULE_CYCLE = 600000;
    public static final String PATH_SPLIT = "/";
    public static final String JSON_SUFFIX = ".json";
    public static final String LOCAL_RES_PATH = "classpath:local";
    public static final String UPDATE_DATA_CONFIG_FILE_PATH = LOCAL_RES_PATH + "/config/DataUpdateCycleConfig.json";
    public static final long DEFAULT_ERROR_CYCLE_TIME = SCHEDULE_CYCLE * 3;

}
