package com.shou.polar.service;

import com.shou.polar.props.ResNameSpace;
import org.jboss.logging.Logger;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.Semaphore;
import java.util.concurrent.atomic.AtomicBoolean;

@Service
public class UpdateEvent {
    private Logger logger = Logger.getLogger(UpdateEvent.class);
    private static final int WAIT_TIME = 500;
    private Semaphore signals;
    private Set<String> RES_NAMES;
    private Map<String, Boolean> resHashMap;
    private AtomicBoolean timerIsClosed;
    private Timer timer;

    public UpdateEvent() {
        RES_NAMES = Collections.synchronizedSet(Set.of(ResNameSpace.getNames()));
        signals = new Semaphore(1);
        resHashMap = Collections.synchronizedMap(new HashMap<>());
        timer = new Timer();
        timerIsClosed = new AtomicBoolean(false);
    }

    /**
     * 当某个数据更新时必须要到这里报道(所有需要向前端推送的数据)
     *
     * @param resName 持有资源名称
     */
    public synchronized void updateRes(String resName) {
        if (RES_NAMES.contains(resName)) {
            resHashMap.put(resName, true);
            logger.info("update resource: " + resName);
            waitTime();
        } else {
            logger.error("resource name: " + resName + " is invalid.");
        }
    }

    /**
     *  等待一段时间让其他功能更新资源状态
     */
    private void waitTime() {
        if (!timerIsClosed.get()) {
            timerIsClosed.set(true);
            timer.schedule(new TimerTask() {
                @Override
                public void run() {
                    timerIsClosed.set(false);
                    signals.release();
                }
            }, WAIT_TIME);
        }
    }

    /**
     * 线程等待获得最新的资源更新列表
     *
     * @return 已更新资源列表
     */
    public synchronized Map<String, Boolean> waitAndGet() {
        try {
            resHashMap.clear();
            signals.acquire();
        } catch (InterruptedException e) {
            e.printStackTrace();
            logger.error(e);
        }
        return resHashMap;
    }
}
