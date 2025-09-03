package com.jttam.glig.domain.apply;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/apply")
public class ApplyController {
    private final ApplyControllerService service;

    public ApplyController(ApplyControllerService service) {
        this.service = service;
    }

    // ...add endpoints as needed...
}
