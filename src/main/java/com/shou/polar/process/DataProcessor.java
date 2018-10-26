package com.shou.polar.process;

import org.apache.commons.lang3.StringUtils;

import java.util.HashSet;
import java.util.Set;

public abstract class DataProcessor {
    private static Set<String> PROCESSOR_NAMES;
    private final String configName;

    static {
        PROCESSOR_NAMES = new HashSet<>();
    }

    DataProcessor(final String configName) {
        if (!StringUtils.isEmpty(configName) && !PROCESSOR_NAMES.contains(configName)) {
            PROCESSOR_NAMES.add(this.configName = configName);
        } else {
            throw new RuntimeException("configName could not be null or empty or same");
        }
    }

    public String getConfigName() {
        return configName;
    }

    public abstract void execute();
}
