package com.jttam.glig.testdata;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.jttam.glig.domain.application.Application;
import com.jttam.glig.domain.application.ApplicationRepository;
import com.jttam.glig.domain.task.Task;
import com.jttam.glig.domain.task.TaskRepository;
import com.jttam.glig.domain.user.User;
import com.jttam.glig.domain.user.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class TestDataService {

    ApplicationRepository applicationRepository;
    UserRepository userRepository;
    TaskRepository taskRepository;

    private ApplicationTestData applyData;
    private UserTestData userData;
    private TaskTestData taskData;

    public TestDataService(ApplicationRepository applyRepository, UserRepository userRepository,
            TaskRepository taskRepository, ApplicationTestData applyData, UserTestData userData,
            TaskTestData taskData) {
        this.applicationRepository = applyRepository;
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
        this.applyData = applyData;
        this.userData = userData;
        this.taskData = taskData;
    }

    private static final Logger logger = LoggerFactory.getLogger(TestDataService.class);

    public void consoleLogDataBase() {
        applicationRepository.findAll().forEach(apply -> logger.info(apply.toString()));
        taskRepository.findAll().forEach(task -> logger.info(task.toString()));
        userRepository.findAll().forEach(user -> logger.info(user.toString()));
    }

    @Transactional
    public void createAllTestData() {

        resetDataBase();

        Map<String, User> users = userData.createTestUsers();
        Map<String, Task> tasks = taskData.createTestTasks(users);
        Map<String, Application> applications = applyData.createTestApplications(users, tasks);
    }

    public void resetDataBase() {
        applyData.cleanUp();
        taskData.cleanUp();
        userData.cleanUp();
    }

    public void removeApplies() {
        applyData.cleanUp();
    }

    public void removeTasks() {
        taskData.cleanUp();
    }
}
