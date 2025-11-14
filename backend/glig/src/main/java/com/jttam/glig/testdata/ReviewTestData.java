package com.jttam.glig.testdata;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.jttam.glig.domain.application.Application;
import com.jttam.glig.domain.task.Task;
import com.jttam.glig.domain.user.User;
import com.jttam.glig.review.Review;
import com.jttam.glig.review.ReviewRepository;

/**
 * Test data component for creating sample Review entities.
 * Provides review data for integration tests and development database seeding.
 */
@Component
public class ReviewTestData {

    private final ReviewRepository reviewRepository;

    public ReviewTestData(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    /**
     * Creates sample review test data for completed tasks.
     * Simplified to work with bulk-generated test data.
     * 
     * @param users Map of test users
     * @param tasks Map of test tasks
     * @param applications Map of test applications
     * @return Map of created Review entities (empty for now, bulk data is sufficient)
     */
    public Map<String, Review> createTestReviews(Map<String, User> users, Map<String, Task> tasks,
            Map<String, Application> applications) {
        reviewRepository.deleteAll();
        
        // Reviews can be added manually through the UI for testing
        // Bulk task data provides sufficient volume for testing
        Map<String, Review> reviews = new HashMap<>();
        
        return reviews;
    }

    /**
     * Removes all review test data from the database.
     * Should be called before creating new test data or during test cleanup.
     */
    public void cleanUp() {
        reviewRepository.deleteAll();
    }
}
