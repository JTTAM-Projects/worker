package com.jttam.glig.domain.worker;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/worker")
public class WorkerController {
    private final WorkerControllerService service;

    public WorkerController(WorkerControllerService service) {
        this.service = service;
    }

    // ...endpointeja tarvittaessa...
}
