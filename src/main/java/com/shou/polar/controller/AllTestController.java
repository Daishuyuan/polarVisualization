package com.shou.polar.controller;

import com.shou.polar.service.UpdateEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class AllTestController {
    private final UpdateEvent updateEvent;

    @Autowired
    public AllTestController(UpdateEvent updateEvent) {
        this.updateEvent = updateEvent;
    }

    @RequestMapping("/advice")
    public String testAdvice() {
        throw new RuntimeException("advice test");
    }

    @RequestMapping("/pushData/{name}")
    public void pushData(@PathVariable String name) {
        updateEvent.updateRes(name);
    }
}
