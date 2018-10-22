package com.shou.polar.controller;

import com.google.gson.JsonObject;
import com.shou.polar.service.BackToFrontAdvice;
import org.apache.catalina.servlet4preview.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ApiController {
    private final BackToFrontAdvice advice;

    @Autowired
    public ApiController(BackToFrontAdvice advice) {
        this.advice = advice;
    }

    @GetMapping("/errors")
    public List<String> getErrors(HttpServletRequest request) {
        return advice.getErrors(request.getSession().getId());
    }

    @RequestMapping("/theme/{name}")
    public JsonObject getThemePropsByName(@PathVariable String name) {

        return null;
    }

}
