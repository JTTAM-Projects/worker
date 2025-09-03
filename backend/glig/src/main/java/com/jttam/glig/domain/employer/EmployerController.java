package com.jttam.glig.domain.employer;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/employer")
public class EmployerController {
    private final EmployerControllerService service;

    public EmployerController(EmployerControllerService service) {
        this.service = service;
    }

    // ...endpointeja tarvittaessa...
}
