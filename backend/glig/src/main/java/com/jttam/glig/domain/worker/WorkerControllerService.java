package com.jttam.glig.domain.worker;

import org.springframework.stereotype.Service;

@Service
public class WorkerControllerService {
    private final WorkerRepository repository;

    public WorkerControllerService(WorkerRepository repository) {
        this.repository = repository;
    }

    // ...service-metodit...
}
