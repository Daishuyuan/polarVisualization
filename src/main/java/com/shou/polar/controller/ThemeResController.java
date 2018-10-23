package com.shou.polar.controller;

import com.shou.polar.props.UpdateEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class ThemeResController {

    @RequestMapping("/theme/{name}")
    public String getThemeConfiguration(@PathVariable String name) {

        return "";
    }
}
