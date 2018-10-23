package com.shou.polar.controller;

import com.shou.polar.service.BackToFrontAdvice;
import org.apache.catalina.servlet4preview.http.HttpServletRequest;
import org.apache.logging.log4j.core.util.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ApiController {
    private final BackToFrontAdvice advice;
    private static final String SPLIT = "/";
    private static final String SUFFIX = ".json";
    private static final String DEFAULT_FILE_TYPE = "UTF-8";
    private static final String LOCAL_RES_PATH = "classpath:local";
    private static final String LOCAL_SCENES_RES_PATH = LOCAL_RES_PATH + "/scenes";
    private static final String LOCAL_DIAGRAMS_RES_PATH = LOCAL_RES_PATH + "/diagrams";

    @Autowired
    public ApiController(BackToFrontAdvice advice) {
        this.advice = advice;
    }

    private String readFileContentByPath(String path) throws IOException {
        File file = ResourceUtils.getFile(path);
        BufferedReader reader = null;
        String res = "";
        if (file.exists()) {
            reader = new BufferedReader(new InputStreamReader(new FileInputStream(file), DEFAULT_FILE_TYPE));
            res = IOUtils.toString(reader);
        }
        if (reader != null) {
            reader.close();
        }
        return res;
    }

    @GetMapping("/errors")
    public List<String> getErrors(HttpServletRequest request) {
        return advice.getErrors(request.getSession().getId());
    }

    @RequestMapping("/diagrams/{name}")
    public String getDiagramsByName(@PathVariable String name) throws IOException {
        return readFileContentByPath(LOCAL_DIAGRAMS_RES_PATH + SPLIT + name + SUFFIX);
    }

    @RequestMapping("/scenes/{name}")
    public String getThemePropsByName(@PathVariable String name) throws IOException {
        return readFileContentByPath(LOCAL_SCENES_RES_PATH + SPLIT + name + SUFFIX);
    }

}
