package com.shou.polar.props;

import org.springframework.context.ApplicationEvent;

public class UpdateEvent extends ApplicationEvent {
    private String msg;

    public UpdateEvent(Object source, String msg) {
        super(source);
        this.msg = msg;
    }

    public String getMsg() {
        return msg;
    }
}
