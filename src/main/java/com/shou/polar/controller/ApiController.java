package com.shou.polar.controller;

import com.shou.polar.service.ControllersAdviceService;
import org.apache.catalina.servlet4preview.http.HttpServletRequest;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

import com.shou.polar.configure.PolarCts;

import javax.servlet.http.HttpServletResponse;

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

    @RequestMapping(value = {"/getTarFilesNames/{type}"}, method = RequestMethod.GET)
    public List<String> getTargetFileNamesList(@PathVariable String type) throws IOException {
        List<String> names = new ArrayList<>();
        File dir = ResourceUtils.getFile(PolarCts.DISPLAY_RES_PATH + PolarCts.PATH_SPLIT + type);
        if (dir.exists() && dir.isDirectory()) {
            for (File file : Objects.requireNonNull(dir.listFiles())) {
                names.add(file.getName());
            }
        }
        return names;
    }

    @RequestMapping(value = {"/downloadImage/{type}/{name}.{tails}"}, method = RequestMethod.GET)
    @ResponseBody
    public String downloadImage(@PathVariable String type,
                                @PathVariable String name,
                                @PathVariable String tails,
                                HttpServletResponse response) throws IOException {
        String path = StringUtils.join(type, PolarCts.PATH_SPLIT, name, PolarCts.PERIOD_SPLIT, tails);
        String realPath = StringUtils.join(PolarCts.DISPLAY_RES_PATH + PolarCts.PATH_SPLIT + path);
        File image = ResourceUtils.getFile(realPath);
        if (image.exists() && image.isFile()) {
            response.setContentType("application/force-download");
            response.setHeader("Cache-Control", "max-age=604800");
            response.addHeader("Content-Disposition", "attachment;fileName=" + path);
            OutputStream os = response.getOutputStream();
            os.write(FileUtils.readFileToByteArray(image));
            return "download success";
        } else {
            return "download failure";
        }
    }
}
