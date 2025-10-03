package com.jttam.glig.domain.employerprofile;

import java.util.Optional;

import com.jttam.glig.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployerProfileRepository extends JpaRepository<EmployerProfile, Long> {
    Optional<EmployerProfile> findByUser(User user);
    Optional<EmployerProfile> findByUser_UserId(String userId);
    boolean existsByUser(User user);
}
