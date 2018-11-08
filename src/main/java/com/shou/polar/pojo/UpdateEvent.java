package com.shou.polar.pojo;

import org.springframework.context.ApplicationEvent;

public class UpdateEvent extends ApplicationEvent {
    private ResNameSpace msg;

    public UpdateEvent(Object source, ResNameSpace msg) {
        super(source);
        this.msg = msg;
    }

    public ResNameSpace getMsg() {
        return msg;
    }
}
