package com.shou.polar.component;

import com.shou.polar.props.ResNameSpace;
import com.shou.polar.props.UpdateEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.Semaphore;

@Component
public class ResUpdateListener implements ApplicationListener<UpdateEvent> {
    // Make thread don't go on and wait for next message;
    private static Semaphore LOCKER;
    // all resource names in this set;
    private static Set<String> RES_NAMES;
    // all messages received in this queue
    private static Queue<String> MSG_QUEUE;

    public ResUpdateListener() {
        LOCKER = new Semaphore(1);
        RES_NAMES = Set.of(ResNameSpace.getNames());
        MSG_QUEUE = new ConcurrentLinkedQueue<>();
    }

    @Override
    public void onApplicationEvent(UpdateEvent updateEvent) {
        String updateMsg = updateEvent.getMsg();
        if (RES_NAMES.contains(updateMsg)) {
            MSG_QUEUE.add(updateMsg);
            LOCKER.release();
        }
    }

    public static synchronized String waitAndGet() throws InterruptedException {
        LOCKER.acquire();
        StringBuilder sb = new StringBuilder();
        while (!MSG_QUEUE.isEmpty()) {
            sb.append(MSG_QUEUE.poll() + ",");
        }
        return sb.substring(0, sb.length() - 1);
    }
}
