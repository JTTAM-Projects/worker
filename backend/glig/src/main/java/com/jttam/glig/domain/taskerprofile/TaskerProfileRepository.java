package com.jttam.glig.domain.taskerprofile;

import com.jttam.glig.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TaskerProfileRepository extends JpaRepository<TaskerProfile, Long> {
    Optional<TaskerProfile> findByUser(User user);
    Optional<TaskerProfile> findByUser_UserId(String userId);
}
