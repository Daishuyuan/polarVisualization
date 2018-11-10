package com.shou.polar;

import com.shou.polar.component.ResUpdateListener;
import com.shou.polar.configure.PolarCts;
import com.shou.polar.service.TargetPathScheduledTaskService;
import com.shou.polar.utils.MessagesUtils;
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
    private static ResUpdateListener resUpdateListener;
    private static TargetPathScheduledTaskService targetPathScheduledTaskService;

    @Autowired
    public PolarApplication(
            ResUpdateListener resUpdateListener,
            TargetPathScheduledTaskService targetPathScheduledTaskService) {
        PolarApplication.resUpdateListener = resUpdateListener;
        PolarApplication.targetPathScheduledTaskService = targetPathScheduledTaskService;
    }

    @RequestMapping(value = "/push", produces = "text/event-stream")
    public @ResponseBody
    String push() {
        return MessagesUtils.getEventMessage(resUpdateListener.receiveMsg());
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

    @RequestMapping("/test")
    public String testPage() {return "test";}

    public static void main(String[] args) {
        // 运行代码
        SpringApplication.run(PolarApplication.class, args);

        // 数据装配
        targetPathScheduledTaskService.configAndRun();
    }
}
