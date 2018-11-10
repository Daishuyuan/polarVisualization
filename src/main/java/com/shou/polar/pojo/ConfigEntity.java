package com.shou.polar.pojo;

/**
 * ConfigEntity
 * 用于读取数据处理器的配置文件实体
 *
 * @author dsy 2018/11/07
 */
public class ConfigEntity {
    private String superParams;    // 超参数，灵活配置数据处理器运行
    private String entityClass;    // 处理器的类型实体的地址
    private String name;           // 全局唯一名称
    private boolean startInInit;   // 是否在初始化的时候调用
    private long scheduledCycle;   // 调用周期
    private String cycleTimeRecord;// 记录上一次调用时间
    private String description;    // 描述

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

    public boolean isStartInInit() {
        return startInInit;
    }

    public void setStartInInit(boolean startInInit) {
        this.startInInit = startInInit;
    }
}
