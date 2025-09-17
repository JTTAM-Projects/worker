package com.jttam.glig.domain.apply;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplyRepository extends JpaRepository<Apply, ApplyId> {
    // ...custom queries if needed...
}
