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
     * 
     * Prerequisites:
     * - Requires existing User, Task, and Application test data
     * - Reviews are created only for tasks with ACCEPTED applications
     * - Maintains referential integrity with database constraints
     * 
     * @param users Map of test users (user1, user2, user3, auth0)
     * @param tasks Map of test tasks (completedTask1, completedTask2)
     * @param applications Map of test applications (not directly used but required for context)
     * @return Map of created Review entities with descriptive keys
     */
    public Map<String, Review> createTestReviews(Map<String, User> users, Map<String, Task> tasks,
            Map<String, Application> applications) {
        reviewRepository.deleteAll();

        User user1 = users.get("user1");
        User user2 = users.get("user2");
        User user3 = users.get("user3");
        User auth0 = users.get("auth0");

        Task completedTask1 = tasks.get("completedTask1");
        Task completedTask2 = tasks.get("completedTask2");

        Map<String, Review> reviews = new HashMap<>();

        // Create bidirectional reviews for completedTask1 (user1 employer, user3 tasker)
        // Requires: user3 has ACCEPTED application (acceptedForCompletedTask1) for completedTask1
        // Create bidirectional reviews for completedTask1 (user1 employer, user3 tasker)
        // Requires: user3 has ACCEPTED application (acceptedForCompletedTask1) for completedTask1
        Review employerReviewsTasker1 = new Review();
        employerReviewsTasker1.setTask(completedTask1);
        employerReviewsTasker1.setReviewer(user1);
        employerReviewsTasker1.setReviewee(user3);
        employerReviewsTasker1.setRating(5);
        employerReviewsTasker1.setComment("Excellent work! Very professional and completed the task perfectly.");
        Review savedReview1 = reviewRepository.save(employerReviewsTasker1);
        reviews.put("employerReviewsTasker1", savedReview1);

        Review taskerReviewsEmployer1 = new Review();
        taskerReviewsEmployer1.setTask(completedTask1);
        taskerReviewsEmployer1.setReviewer(user3);
        taskerReviewsEmployer1.setReviewee(user1);
        taskerReviewsEmployer1.setRating(4);
        taskerReviewsEmployer1.setComment("Good employer, clear instructions and fair payment.");
        Review savedReview2 = reviewRepository.save(taskerReviewsEmployer1);
        reviews.put("taskerReviewsEmployer1", savedReview2);

        // Create bidirectional reviews for completedTask2 (user2 employer, auth0 tasker)
        // Requires: auth0 has ACCEPTED application (testApplication14) for completedTask2
        Review employerReviewsAuth0 = new Review();
        employerReviewsAuth0.setTask(completedTask2);
        employerReviewsAuth0.setReviewer(user2);
        employerReviewsAuth0.setReviewee(auth0);
        employerReviewsAuth0.setRating(3);
        employerReviewsAuth0.setComment("Task was completed on time but could have been better quality.");
        Review savedReview3 = reviewRepository.save(employerReviewsAuth0);
        reviews.put("employerReviewsAuth0", savedReview3);

        Review auth0ReviewsEmployer = new Review();
        auth0ReviewsEmployer.setTask(completedTask2);
        auth0ReviewsEmployer.setReviewer(auth0);
        auth0ReviewsEmployer.setReviewee(user2);
        auth0ReviewsEmployer.setRating(5);
        auth0ReviewsEmployer.setComment(null);
        Review savedReview4 = reviewRepository.save(auth0ReviewsEmployer);
        reviews.put("auth0ReviewsEmployer", savedReview4);

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
