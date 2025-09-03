package com.jttam.glig.domain.employer;

import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployerRepository extends JpaRepository<Employer, Long> {
    // ...custom queries if needed...
}
