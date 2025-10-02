package com.jttam.glig.domain.task;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findAllByUser_UserName(String userName);

    List<Task> findByTitle(String string);
}
