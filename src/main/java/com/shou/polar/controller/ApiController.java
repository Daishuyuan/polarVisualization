package com.shou.polar.controller;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.google.gson.Gson;
import com.shou.polar.service.BackToFrontAdvice;
import org.apache.catalina.servlet4preview.http.HttpServletRequest;
import org.apache.logging.log4j.core.util.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.nio.charset.Charset;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ApiController {
    private final BackToFrontAdvice advice;
    private final Gson gson;
    private static final String DEFAULT_FILE_TYPE = "UTF-8";
    private static final String LOCAL_RES_PATH = "classpath:local";
    private static final String LOCAL_SCENES_RES_PATH = LOCAL_RES_PATH + "/scenes";

    @Autowired
    public ApiController(BackToFrontAdvice advice) {
        this.advice = advice;
        gson = new Gson();
    }

    @GetMapping("/errors")
    public List<String> getErrors(HttpServletRequest request) {
        return advice.getErrors(request.getSession().getId());
    }

    @RequestMapping("/scenes/{name}")
    public String getThemePropsByName(@PathVariable String name) throws IOException {
        File file = ResourceUtils.getFile(LOCAL_SCENES_RES_PATH + "/" + name + ".json");
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

}
