package com.jttam.glig.domain.employer;

import org.springframework.stereotype.Service;

@Service
public class EmployerControllerService {
    private final EmployerRepository repository;

    public EmployerControllerService(EmployerRepository repository) {
        this.repository = repository;
    }

    // ...service-metodit...
}
