package com.shou.polar.utils;

public class MessagesUtils {
    private static final String PUSH_HEAD = "data:";
    private static final String PUSH_TAIL = "\n\n";
    private static StringBuilder cache = new StringBuilder();

    public static String getEventMessage(String msg) {
        cache.delete(0, cache.length());
        cache.append(PUSH_HEAD).append(msg).append(PUSH_TAIL);
        return cache.toString();
    }
}
