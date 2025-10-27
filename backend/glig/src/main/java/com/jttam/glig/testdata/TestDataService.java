package com.jttam.glig.testdata;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.jttam.glig.domain.application.Application;
import com.jttam.glig.domain.application.ApplicationRepository;
import com.jttam.glig.domain.category.Category;
import com.jttam.glig.domain.category.CategoryRepository;
import com.jttam.glig.domain.location.Location;
import com.jttam.glig.domain.location.LocationRepository;
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
    LocationRepository locationRepository;
    CategoryRepository categoryRepository;

    private ApplicationTestData applyData;
    private UserTestData userData;
    private TaskTestData taskData;
    private ReviewTestData reviewData;
    private LocationTestData locationData;
    private CategoryTestData categoryData;

    public TestDataService(ApplicationRepository applicationRepository, UserRepository userRepository,
            TaskRepository taskRepository, ReviewRepository reviewRepository, LocationRepository locationRepository,
            CategoryRepository categoryRepository, ApplicationTestData applyData, UserTestData userData,
            TaskTestData taskData, ReviewTestData reviewData, LocationTestData locationData,
            CategoryTestData categoryData) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
        this.reviewRepository = reviewRepository;
        this.locationRepository = locationRepository;
        this.categoryRepository = categoryRepository;
        this.applyData = applyData;
        this.userData = userData;
        this.taskData = taskData;
        this.reviewData = reviewData;
        this.locationData = locationData;
        this.categoryData = categoryData;
    }

    private static final Logger logger = LoggerFactory.getLogger(TestDataService.class);

    @Transactional
    public void consoleLogDataBase() {
        applicationRepository.findAll().forEach(apply -> logger.info(apply.toString()));
        taskRepository.findAll().forEach(task -> logger.info(task.toString()));
        locationRepository.findAll().forEach(location -> logger.info(location.toString()));
        userRepository.findAll().forEach(user -> logger.info(user.toString()));
        reviewRepository.findAll().forEach(review -> logger.info(review.toString()));
    }

    @Transactional
    public void createAllTestData() {
        resetDataBase();

        Map<String, User> users = userData.createTestUsers();
        Map<String, Location> locations = locationData.createTestLocations();
        Map<String, Category> categories = categoryData.createTestCategories();
        
        // Create minimal hand-crafted test tasks (3 tasks for specific edge cases)
        Map<String, Task> tasks = taskData.createTestTasks(users, locations, categories);
        
        // Generate bulk test tasks (500 tasks for volume testing)
        Map<String, Task> bulkTasks = taskData.generateBulkTestTasks(users, locations, categories, 500);
        tasks.putAll(bulkTasks);
        
        Map<String, Application> applications = applyData.createTestApplications(users, tasks);
        Map<String, Review> reviews = reviewData.createTestReviews(users, tasks, applications);
        
        logger.info("Test data created: {} users, {} locations, {} categories, {} tasks, {} applications, {} reviews",
                users.size(), locations.size(), categories.size(), tasks.size(), applications.size(), reviews.size());
    }

    public void resetDataBase() {
        reviewData.cleanUp();
        applyData.cleanUp();
        taskData.cleanUp();
        locationData.cleanUp();
        userData.cleanUp();
        categoryData.cleanUp();
    }

    public void removeApplies() {
        applyData.cleanUp();
    }

    public void removeTasks() {
        taskData.cleanUp();
    }
}
