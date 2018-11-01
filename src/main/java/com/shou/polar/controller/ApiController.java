package com.shou.polar.controller;

import com.shou.polar.service.ControllersAdviceService;
import org.apache.catalina.servlet4preview.http.HttpServletRequest;

import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.List;
import com.shou.polar.configure.PolarCts;

@RestController
@RequestMapping("/api")
public class ApiController {
    private final ControllersAdviceService advice;

    @Autowired
    public ApiController(ControllersAdviceService advice) {
        this.advice = advice;
    }

    private String readFileContentByPath(String path) throws IOException {
        return FileUtils.readFileToString(ResourceUtils.getFile(path), StandardCharsets.UTF_8);
    }

    @GetMapping("/errors")
    public List<String> getErrors(HttpServletRequest request) {
        return advice.getErrors(request.getSession().getId());
    }

    @RequestMapping("/diagrams/{name}")
    public String getDiagramsByName(@PathVariable String name) throws IOException {
        return readFileContentByPath(PolarCts.DIAGRAMS_RES_PATH + PolarCts.PATH_SPLIT + name + PolarCts.JSON_SUFFIX);
    }

    @RequestMapping("/scenes/{name}")
    public String getThemePropsByName(@PathVariable String name) throws IOException {
        return readFileContentByPath(PolarCts.SCENES_RES_PATH + PolarCts.PATH_SPLIT + name + PolarCts.JSON_SUFFIX);
    }

    @RequestMapping("/display/{name}")
    public String getDisplayDataByName(@PathVariable String name) throws IOException {
        return readFileContentByPath(PolarCts.DISPLAY_RES_PATH + PolarCts.PATH_SPLIT + name + PolarCts.JSON_SUFFIX);
    }
}
