package com.shou.polar.pojo;

public abstract class DataProcessor {
    private ConfigEntity configEntity = null;

    public abstract void execute();

    public ConfigEntity getConfigEntity() {
        return configEntity;
    }

    public void setConfigEntity(ConfigEntity configEntity) {
        this.configEntity = configEntity;
    }
}
