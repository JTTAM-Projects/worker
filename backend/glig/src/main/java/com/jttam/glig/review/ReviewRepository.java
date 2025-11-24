package com.jttam.glig.review;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for the Review entity.
 */
@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    /**
     * Finds all reviews where the user was the reviewee (received reviews).
     * This returns reviews for both Tasker and Employer roles.
     *
     * @param userId The ID of the user whose reviews are being fetched.
     * @param pageable Pagination information.
     * @return A paginated list of reviews.
     */
    @Query("SELECT r FROM Review r WHERE r.reviewee.userName = :userId")
    Page<Review> findReviewsForUser(@Param("userId") String userId, Pageable pageable);

    /**
     * Finds all reviews written by a specific reviewer.
     *
     * @param userId The ID of the reviewer.
     * @param pageable Pagination information.
     * @return A paginated list of reviews.
     */
    @Query("SELECT r FROM Review r WHERE r.reviewer.userName = :userId")
    Page<Review> findReviewsByReviewer(@Param("userId") String userId, Pageable pageable);

    /**
     * Finds all reviews for a specific task.
     *
     * @param taskId The ID of the task.
     * @return A list of reviews for the task.
     */
    @Query("SELECT r FROM Review r WHERE r.task.id = :taskId")
    List<Review> findReviewsForTask(@Param("taskId") Long taskId);

    /**
     * Checks if a review already exists for a given task by a specific reviewer.
     * This is used to enforce the business rule that a user can only review a task once.
     *
     * @param taskId The ID of the task.
     * @param reviewerId The ID of the user who is potentially writing the review.
     * @return true if a review exists, false otherwise.
     */
    boolean existsByTask_IdAndReviewer_UserName(Long taskId, String reviewerId);

    /**
     * Finds a specific review by its task and reviewer.
     * This can be useful for edit/delete operations where you don't have the review ID directly.
     *
     * @param taskId The ID of the task.
     * @param reviewerId The ID of the reviewer.
     * @return An Optional containing the Review if found.
     */
    Optional<Review> findByTask_IdAndReviewer_UserName(Long taskId, String reviewerId);

    /**
     * Calculates the average rating for a specific user (as reviewee).
     *
     * @param userId The ID of the user.
     * @return The average rating, or null if no reviews exist.
     */
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.reviewee.userName = :userId")
    Double calculateAverageRatingForUser(@Param("userId") String userId);

    @Query("SELECT r FROM Review r JOIN r.task t " +
           "WHERE r.reviewee.userName = :username " +
           "AND t.user.userName != :username")
    Page<Review> findTaskerReviewsForUser(@Param("username") String username, Pageable pageable);

    @Query("SELECT r FROM Review r JOIN r.task t " +
           "WHERE r.reviewee.userName = :username " +
           "AND t.user.userName = :username")
    Page<Review> findEmployerReviewsForUser(@Param("username") String username, Pageable pageable);
}
