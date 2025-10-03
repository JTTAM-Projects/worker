package com.jttam.glig.service;

import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.criteria.Predicate;

import org.springframework.data.jpa.domain.Specification;

import com.jttam.glig.domain.apply.Apply;
import com.jttam.glig.domain.apply.ApplyDataGridFilters;
import com.jttam.glig.domain.task.Task;
import com.jttam.glig.domain.task.TaskDataGridFilters;

public class Specifications {

    // with specification, you can build more flexible queries for data tables that
    // uses filtering
    public static Specification<Apply> withApplyFilters(ApplyDataGridFilters filters, String username) {
        return (root, query, criteriabuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(criteriabuilder.equal(root.get("user").get("userName"), username));

            if (filters != null) {

                if (filters.applyStatus() != null) {
                    predicates.add(criteriabuilder.equal(root.get("applyStatus"), filters.applyStatus()));
                }
            }
            return criteriabuilder.and(predicates.toArray(new Predicate[0]));
        };

    }

    public static Specification<Task> withTaskFilters(TaskDataGridFilters filters) {
        return (root, query, criteriabuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filters != null) {

                if (filters.category() != null) {
                    predicates.add(criteriabuilder.equal(root.get("category"), filters.category()));
                }

                if (filters.status() != null) {
                    predicates.add(criteriabuilder.equal(root.get("status"), filters.status()));
                }
            }
            return criteriabuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

}
