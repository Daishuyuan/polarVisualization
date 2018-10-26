package com.shou.polar;

import com.shou.polar.component.ResUpdateListener;
import com.shou.polar.process.LidarDataProcessor;
import com.shou.polar.service.TargetPathScheduledTaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@EnableScheduling
@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)
public class PolarApplication {
    private static final String PUSH_HEAD = "data:";
    private static final String PUSH_TAIL = "\n\n";

    @RequestMapping(value = "/push", produces = "text/event-stream")
    public @ResponseBody String push() throws InterruptedException {
        return PUSH_HEAD + ResUpdateListener.waitAndGet() + PUSH_TAIL;
    }

    @RequestMapping("/")
    public String startPage() {
        return "index";
    }

    @RequestMapping("/cutScene")
    public String cutScene() {
        return "cutScene";
    }

    @RequestMapping("/errors")
    public String errorPage() {
        return "error";
    }

    public static void main(String[] args) {
        // 运行代码
        SpringApplication.run(PolarApplication.class, args);

        // 数据装配
        TargetPathScheduledTaskService.addTaskSchedule(new LidarDataProcessor());
        TargetPathScheduledTaskService.configAndRun();
    }
}
