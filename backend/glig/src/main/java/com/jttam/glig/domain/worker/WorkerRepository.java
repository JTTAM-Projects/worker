package com.jttam.glig.domain.worker;

import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkerRepository extends JpaRepository<Worker, Long> {
    // ...custom queries if needed...
}
