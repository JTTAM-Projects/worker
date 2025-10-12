package com.jttam.glig.service;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import com.jttam.glig.domain.application.Application;
import com.jttam.glig.domain.application.ApplicationDataGridFilters;

public class Specifications {

    // with specification, you can build more flexible queries for data tables that
    // uses filtering
    public static Specification<Application> withApplicationFilters(ApplicationDataGridFilters filters,
            String username) {
        return (root, query, criteriabuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(criteriabuilder.equal(root.get("user").get("userName"), username));

            if (filters != null) {

                if (filters.applicationStatus() != null) {
                    predicates.add(criteriabuilder.equal(root.get("applicationStatus"), filters.applicationStatus()));
                }
            }
            return criteriabuilder.and(predicates.toArray(new Predicate[0]));
        };

    }

}
