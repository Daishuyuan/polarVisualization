package com.shou.polar;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.stereotype.Controller;

@Controller
@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)
public class PolarApplication {

    public static void main(String[] args) {
        SpringApplication.run(PolarApplication.class, args);
    }
}
