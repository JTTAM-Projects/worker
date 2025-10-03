package com.jttam.glig.domain.taskerprofile;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TaskerProfileRepository extends JpaRepository<TaskerProfile, Long> {
    Optional<TaskerProfile> findByUserId(String userId);
}
