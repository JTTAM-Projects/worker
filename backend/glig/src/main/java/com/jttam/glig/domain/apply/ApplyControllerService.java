package com.jttam.glig.domain.apply;

import org.springframework.stereotype.Service;

@Service
public class ApplyControllerService {
    private final ApplyRepository repository;

    public ApplyControllerService(ApplyRepository repository) {
        this.repository = repository;
    }

    // ...service methods...
}
