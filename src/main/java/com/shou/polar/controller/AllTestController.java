package com.shou.polar.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class AllTestController {

    @RequestMapping("/advice")
    public String testAdvice() {
        throw new RuntimeException("advice test");
    }
}
