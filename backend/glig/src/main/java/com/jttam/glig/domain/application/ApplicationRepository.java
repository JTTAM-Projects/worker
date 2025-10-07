package com.jttam.glig.domain.application;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ApplicationRepository extends JpaRepository<Application, ApplicationId> {

    List<Application> findAllByUser_UserName(String username);

    Page<Application> findAll(Specification<Application> spec, Pageable pageable);

    @Query("SELECT a FROM Application a WHERE a.task.id = :taskId AND a.applicationStatus = 'ACCEPTED'")
    Optional<Application> findAcceptedApplicationForTask(@Param("taskId") Long taskId);
}
