package com.jttam.glig.domain.application;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationRepository extends JpaRepository<Application, ApplicationId> {

    List<Application> findAllByUser_UserName(String username);

    Page<Application> findAll(Specification<Application> spec, Pageable pageable);
}
