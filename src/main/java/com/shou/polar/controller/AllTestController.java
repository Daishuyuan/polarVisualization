package com.shou.polar.controller;

import com.shou.polar.component.ComponentsUtils;
import com.shou.polar.pojo.UpdateEvent;
import org.springframework.context.ApplicationContext;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class AllTestController {

    @RequestMapping("/advice")
    public String testAdvice() {
        throw new RuntimeException("advice test");
    }

    @RequestMapping("/pushData/{name}")
    public void pushData(@PathVariable String name)  {
        ApplicationContext context = ComponentsUtils.getApplicationContext();
        context.publishEvent(new UpdateEvent(this, name));
    }
}
