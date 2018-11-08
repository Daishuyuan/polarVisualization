package com.shou.polar.pojo;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

public enum ResNameSpace {
    LIDAR_WTN("lidar_wtn"),
    PRESS("press"),
    ERROR("error"),
    VOID("");
    private final String name;
    private static Map<String, ResNameSpace> SEARCH_MAP;

    static {
        SEARCH_MAP = Collections.synchronizedMap(new HashMap<>());
        for (ResNameSpace value : ResNameSpace.values()) {
            SEARCH_MAP.put(value.name, value);
        }
    }

    ResNameSpace(final String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public static ResNameSpace reflect(String name) {
        if (SEARCH_MAP.containsKey(name)) {
            return SEARCH_MAP.get(name);
        }
        return VOID;
    }
}
