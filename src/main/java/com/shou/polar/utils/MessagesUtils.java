package com.shou.polar.utils;

public class MessagesUtils {
    private static final String PUSH_HEAD = "data:";
    private static final String PUSH_TAIL = "\n\n";

    public static String getEventMessage(String msg) {
        return PUSH_HEAD + msg + PUSH_TAIL;
    }
}
