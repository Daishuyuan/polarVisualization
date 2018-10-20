package com.shou.polar;

import com.shou.polar.component.UpdateEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

@Controller
@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)
public class PolarApplication {
    @Autowired
    UpdateEvent updateEvent;

    @RequestMapping(value = "/dataStatus", produces = "text/event-stream")
    public @ResponseBody Map<String, Boolean> push() {
        return updateEvent.waitAndGet();
    }

    @RequestMapping("/")
    public String startPage() {
        return "index";
    }

    @RequestMapping("/cutScene")
    public String cutScene() {
        return "cutScene";
    }

    public static void main(String[] args) {
        SpringApplication.run(PolarApplication.class, args);
    }
}
