package com.shou.polar.component;

import com.shou.polar.pojo.ResNameSpace;
import com.shou.polar.pojo.UpdateEvent;
import org.apache.commons.lang3.StringUtils;
import org.jboss.logging.Logger;
import org.jetbrains.annotations.NotNull;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;

@Component
public class ResUpdateListener implements ApplicationListener<UpdateEvent> {
    private static final Logger logger = Logger.getLogger(ResUpdateListener.class);
    // delay a short time for inserting more messages;
    private static final int SHORT_TICK = 333;
    // sign of split msg;
    private static final String SPLIT = ",";
    // all resource names in this set and must initialized soon after;
    private static Set<ResNameSpace> RES_NAMES;
    // all messages received in this queue;
    private static Queue<String> MSG_QUEUE;

    public ResUpdateListener() {
        RES_NAMES = Set.of(ResNameSpace.values());
        MSG_QUEUE = new ConcurrentLinkedQueue<>();
    }

    @Override
    public void onApplicationEvent(@NotNull UpdateEvent updateEvent) {
        ResNameSpace updateMsg = updateEvent.getMsg();
        if (RES_NAMES.contains(updateMsg) && !ResNameSpace.VOID.equals(updateMsg)) {
            MSG_QUEUE.add(updateMsg.getName());
        }
    }

    public String receiveMsg() {
        List<String> cache = new ArrayList<>();
        while (!MSG_QUEUE.isEmpty()) {
            String content = MSG_QUEUE.poll();
            if (!cache.contains(content)) {
                cache.add(content);
            }
        }
        try {
            TimeUnit.MILLISECONDS.sleep(SHORT_TICK);
        } catch (InterruptedException e) {
            e.printStackTrace();
            logger.error(e);
        }
        return StringUtils.join(cache, SPLIT);
    }
}
