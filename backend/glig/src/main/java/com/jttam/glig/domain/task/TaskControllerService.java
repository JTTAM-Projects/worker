package com.jttam.glig.domain.task;

import org.springframework.stereotype.Service;

@Service
public class TaskControllerService {
    private final TaskRepository repository;

    public TaskControllerService(TaskRepository repository) {
        this.repository = repository;
    }

    // ...service-metodit...
}
