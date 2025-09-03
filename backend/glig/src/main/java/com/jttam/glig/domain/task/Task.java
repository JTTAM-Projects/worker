package com.jttam.glig.domain.task;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Task {
    @Id
    private Long id;
    // ...lisää kenttiä tarvittaessa...

    // Getterit ja setterit
}
