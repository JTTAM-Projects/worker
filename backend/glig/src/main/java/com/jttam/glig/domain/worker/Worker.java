package com.jttam.glig.domain.worker;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Worker {
    @Id
    private Long id;
    // ...lisää kenttiä tarvittaessa...

    // Getterit ja setterit
}
