package com.shou.polar;

import com.google.common.base.Joiner;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.shou.polar.configure.PolarCts;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.core.util.IOUtils;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.util.ResourceUtils;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Set;

public class PolarApplicationTests {

    @Test
    public void contextLoads() {
        System.out.print(Joiner.on(',').join(Set.of(1,2,3,4,5)));
    }

    @Test
    public void readUDCConfigTest() throws IOException {
        Gson gson = new Gson();
        File configuration = ResourceUtils.getFile(PolarCts.UPDATE_DATA_CONFIG_FILE_PATH);
        String configStr = FileUtils.readFileToString(configuration, StandardCharsets.UTF_8); // 读取文件内容
        JsonObject config = gson.fromJson(configStr, JsonObject.class);
        System.out.print(config);
    }

    @Test
    public void strTest() {
        System.out.println(StringUtils.isEmpty(null));
        System.out.println(StringUtils.isEmpty(""));
    }
}
