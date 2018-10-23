package com.shou.polar.component;

import com.shou.polar.props.ResNameSpace;
import com.shou.polar.props.UpdateEvent;
import org.apache.commons.lang3.StringUtils;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.Semaphore;

@Component
public class ResUpdateListener implements ApplicationListener<UpdateEvent> {
    // delay a short time for inserting more messages;
    private static final int SHORT_TICK = 400;
    // sign of split msg;
    private static final String SPLIT = ",";
    // Make thread don't go on and wait for next message;
    private static Semaphore LOCKER;
    // all resource names in this set and must initialized soon after;
    private static Set<String> RES_NAMES;
    // all messages received in this queue;
    private static Queue<String> MSG_QUEUE;
    // schedule timer;
    private static Timer TIMER;

    public ResUpdateListener() {
        LOCKER = new Semaphore(1);
        RES_NAMES = Set.of(ResNameSpace.getNames());
        MSG_QUEUE = new ConcurrentLinkedQueue<>();
        TIMER = new Timer();
    }

    @Override
    public void onApplicationEvent(UpdateEvent updateEvent) {
        String updateMsg = updateEvent.getMsg();
        if (RES_NAMES.contains(updateMsg)) {
            if (MSG_QUEUE.isEmpty()) {
                TIMER.schedule(new TimerTask() {
                    @Override
                    public void run() {
                        LOCKER.release();
                    }
                }, SHORT_TICK);
            }
            MSG_QUEUE.add(updateMsg);
        }
    }

    public static synchronized String waitAndGet() throws InterruptedException {
        LOCKER.acquire();
        List<String> cache = new ArrayList<>();
        while (!MSG_QUEUE.isEmpty()) {
            cache.add(MSG_QUEUE.poll());
        }
        return StringUtils.join(cache, SPLIT);
    }
}
