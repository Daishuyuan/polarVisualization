package com.shou.polar.controller;

import com.shou.polar.service.UpdateEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class ThemeResController {
    private UpdateEvent updateEvent;

    @Autowired
    public ThemeResController(UpdateEvent updateEvent) {
        this.updateEvent = updateEvent;
    }

    @RequestMapping("/theme/{name}")
    public String getThemeConfiguration(@PathVariable String name) {

        return "";
    }
}
