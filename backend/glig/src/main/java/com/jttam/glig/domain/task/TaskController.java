package com.jttam.glig.domain.task;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/task")
public class TaskController {
    private final TaskControllerService service;

    public TaskController(TaskControllerService service) {
        this.service = service;
    }

    // ...endpointeja tarvittaessa...
}
