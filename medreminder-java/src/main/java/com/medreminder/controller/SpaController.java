package com.medreminder.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    // Forward SPA client-side routes to index.html so browser refresh works seamlessly
    @GetMapping(value = { "/login", "/calendar", "/admin" })
    public String forwardSpaRoutes() {
        return "forward:/index.html";
    }
}
