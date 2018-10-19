package com.shou.polar.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class ThemeDataController {
    @RequestMapping("/theme/{name}")
    public String getThemeConfiguration(@PathVariable String name) {

        return "";
    }
}
