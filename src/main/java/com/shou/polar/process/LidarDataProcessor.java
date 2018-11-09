package com.shou.polar.process;

import com.shou.polar.pojo.DataProcessor;

import java.util.concurrent.Semaphore;

public class LidarDataProcessor extends DataProcessor {

    @Override
    public void execute() {
        Semaphore semaphore = new Semaphore(1);
        try {
            semaphore.acquire();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        semaphore.release();
    }
}
