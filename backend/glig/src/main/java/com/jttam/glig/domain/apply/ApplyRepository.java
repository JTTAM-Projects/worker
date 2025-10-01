package com.jttam.glig.domain.apply;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplyRepository extends JpaRepository<Apply, ApplyId> {

    List<Apply> findAllByUser_UserName(String username);

    Page<Apply> findAll(Specification<Apply> spec, Pageable pageable);
}
