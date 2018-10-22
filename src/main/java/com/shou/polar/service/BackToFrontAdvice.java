package com.shou.polar.service;

import org.jboss.logging.Logger;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.beans.propertyeditors.CustomNumberEditor;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;

import java.text.SimpleDateFormat;
import java.util.*;

@Service
@ControllerAdvice
public class BackToFrontAdvice {
    private final Logger logger = Logger.getLogger(BackToFrontAdvice.class);
    private final Map<String, List<String>> ERROR_POOL;

    public BackToFrontAdvice() {
        ERROR_POOL = Collections.synchronizedMap(new HashMap<>());
    }

    @ExceptionHandler(value = Exception.class)
    public void exception(Exception e, WebRequest request) {
        String sessionId = request.getSessionId();
        if (!ERROR_POOL.containsKey(sessionId)) {
            ERROR_POOL.put(sessionId, new ArrayList<>());
        }
        ERROR_POOL.get(sessionId).add(e.getLocalizedMessage());
        logger.error(e.getMessage());
    }

    @ModelAttribute
    public void addAttribute(Model model) {
        model.addAttribute("msg", "额外信息");
    }

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        binder.registerCustomEditor(Long.class, new CustomNumberEditor(Long.class, true));
        binder.registerCustomEditor(Date.class, new CustomDateEditor(new SimpleDateFormat("yyyy-MM-dd"), true));
    }

    public synchronized List<String> getErrors(String sessionId) {
        List<String> cache = new ArrayList<>();
        if (ERROR_POOL.containsKey(sessionId)) {
            List<String> errors = ERROR_POOL.get(sessionId);
            cache.addAll(errors);
            errors.clear();
        }
        return cache;
    }
}
