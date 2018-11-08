package com.shou.polar.pojo;

public class ConfigEntity {
    private String superParams;
    private String entityClass;
    private String name;
    private long scheduledCycle;
    private String cycleTimeRecord;
    private String description;

    public String getEntityClass() {
        return entityClass;
    }

    public void setEntityClass(String entityClass) {
        this.entityClass = entityClass;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public long getScheduledCycle() {
        return scheduledCycle;
    }

    public void setScheduledCycle(long scheduledCycle) {
        this.scheduledCycle = scheduledCycle;
    }

    public String getCycleTimeRecord() {
        return cycleTimeRecord;
    }

    public void setCycleTimeRecord(String cycleTimeRecord) {
        this.cycleTimeRecord = cycleTimeRecord;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSuperParams() {
        return superParams;
    }

    public void setSuperParams(String superParams) {
        this.superParams = superParams;
    }
}
