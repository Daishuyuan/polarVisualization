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

    @GetMapping("/sessionId")
    public String uid(HttpServletRequest request) {
        return request.getSession().getId();
    }

    @RequestMapping("/errors/{sessionId}")
    public List<String> getErrors(@PathVariable String sessionId) {
        return advice.getErrors(sessionId);
    }

    @RequestMapping("/theme/{name}")
    public JsonObject getThemePropsByName(@PathVariable String name) {

        return null;
    }

}
