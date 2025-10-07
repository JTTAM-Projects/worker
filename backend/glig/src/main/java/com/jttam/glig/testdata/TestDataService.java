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
import com.jttam.glig.review.Review;
import com.jttam.glig.review.ReviewRepository;

import jakarta.transaction.Transactional;

@Service
public class TestDataService {

    ApplicationRepository applicationRepository;
    UserRepository userRepository;
    TaskRepository taskRepository;
    ReviewRepository reviewRepository;

    private ApplicationTestData applyData;
    private UserTestData userData;
    private TaskTestData taskData;
    private ReviewTestData reviewData;

    public TestDataService(ApplicationRepository applyRepository, UserRepository userRepository,
            TaskRepository taskRepository, ReviewRepository reviewRepository,
            ApplicationTestData applyData, UserTestData userData,
            TaskTestData taskData, ReviewTestData reviewData) {
        this.applicationRepository = applyRepository;
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
        this.reviewRepository = reviewRepository;
        this.applyData = applyData;
        this.userData = userData;
        this.taskData = taskData;
        this.reviewData = reviewData;
    }

    private static final Logger logger = LoggerFactory.getLogger(TestDataService.class);

    public void consoleLogDataBase() {
        applicationRepository.findAll().forEach(apply -> logger.info(apply.toString()));
        taskRepository.findAll().forEach(task -> logger.info(task.toString()));
        userRepository.findAll().forEach(user -> logger.info(user.toString()));
        reviewRepository.findAll().forEach(review -> logger.info(review.toString()));
    }

    @Transactional
    public void createAllTestData() {

        resetDataBase();

        Map<String, User> users = userData.createTestUsers();
        Map<String, Task> tasks = taskData.createTestTasks(users);
        Map<String, Application> applications = applyData.createTestApplications(users, tasks);
        Map<String, Review> reviews = reviewData.createTestReviews(users, tasks, applications);
    }

    public void resetDataBase() {
        reviewData.cleanUp();
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
