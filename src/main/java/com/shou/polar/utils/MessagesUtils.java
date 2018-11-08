package com.shou.polar.utils;

import org.apache.commons.lang3.StringUtils;

public class MessagesUtils {
    private static final String PUSH_HEAD = "data:";
    private static final String PUSH_TAIL = "\n\n";

    public static String getEventMessage(String msg) {
        return StringUtils.join(PUSH_HEAD, msg, PUSH_TAIL);
    }
}
