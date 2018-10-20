package com.shou.polar.controller;

import com.google.gson.JsonObject;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/staticRes")
public class StaticResController {

    @RequestMapping("/theme/{name}")
    public JsonObject getThemePropsByName(@PathVariable String name) {

        return null;
    }

}
