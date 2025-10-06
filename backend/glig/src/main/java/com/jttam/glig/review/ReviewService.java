package com.jttam.glig.review;

import com.jttam.glig.domain.application.Application;
import com.jttam.glig.domain.application.ApplicationRepository;
import com.jttam.glig.domain.task.Task;
import com.jttam.glig.domain.task.TaskRepository;
import com.jttam.glig.domain.task.TaskStatus;
import com.jttam.glig.domain.user.User;
import com.jttam.glig.domain.user.UserRepository;
import com.jttam.glig.exception.custom.ConflictException;
import com.jttam.glig.exception.custom.ForbiddenException;
import com.jttam.glig.exception.custom.NotFoundException;
import com.jttam.glig.review.dto.ReviewRequest;
import com.jttam.glig.review.dto.ReviewResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private final ReviewMapper reviewMapper;

    public ReviewService(ReviewRepository reviewRepository,
                         TaskRepository taskRepository,
                         UserRepository userRepository,
                         ApplicationRepository applicationRepository,
                         ReviewMapper reviewMapper) {
        this.reviewRepository = reviewRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.applicationRepository = applicationRepository;
        this.reviewMapper = reviewMapper;
    }

    @Transactional
    public ReviewResponse createReview(ReviewRequest request, String reviewerUsername) {
        Task task = taskRepository.findById(request.taskId())
                .orElseThrow(() -> new NotFoundException("TASK_NOT_FOUND", "Task with ID " + request.taskId() + " not found."));

        if (task.getStatus() != TaskStatus.COMPLETED) {
            throw new ForbiddenException("TASK_NOT_COMPLETED", "Reviews can only be submitted for completed tasks.");
        }

        if (reviewRepository.existsByTask_IdAndReviewer_UserName(task.getId(), reviewerUsername)) {
            throw new ConflictException("REVIEW_ALREADY_EXISTS", "You have already submitted a review for this task.");
        }

        Application acceptedApplication = applicationRepository.findAcceptedApplicationForTask(task.getId())
                .orElseThrow(() -> new ForbiddenException("NO_ACCEPTED_TASKER", "Cannot review a task with no accepted tasker."));

        User assignedTasker = acceptedApplication.getUser();
        User employer = task.getUser();

        User reviewer = userRepository.findByUserName(reviewerUsername)
                .orElseThrow(() -> new NotFoundException("USER_NOT_FOUND", "Reviewer not found."));

        User reviewee = userRepository.findByUserName(request.revieweeUsername())
                .orElseThrow(() -> new NotFoundException("USER_NOT_FOUND", "Reviewee with username '" + request.revieweeUsername() + "' not found."));

        boolean isEmployerReviewingTasker = reviewer.equals(employer) && reviewee.equals(assignedTasker);
        boolean isTaskerReviewingEmployer = reviewer.equals(assignedTasker) && reviewee.equals(employer);

        if (!isEmployerReviewingTasker && !isTaskerReviewingEmployer) {
            throw new ForbiddenException("INVALID_REVIEW_PARTIES", "You can only review the other party involved in this completed task.");
        }

        Review newReview = reviewMapper.toReviewEntity(request);
        newReview.setTask(task);
        newReview.setReviewer(reviewer);
        newReview.setReviewee(reviewee);

        Review savedReview = reviewRepository.save(newReview);

        return reviewMapper.toReviewResponse(savedReview);
    }

    public Page<ReviewResponse> getReviewsForTaskerProfile(String taskerUsername, Pageable pageable) {
        Page<Review> reviews = reviewRepository.findTaskerReviewsForUser(taskerUsername, pageable);
        return reviews.map(reviewMapper::toReviewResponse);
    }

    public Page<ReviewResponse> getReviewsForEmployerProfile(String employerUsername, Pageable pageable) {
        Page<Review> reviews = reviewRepository.findEmployerReviewsForUser(employerUsername, pageable);
        return reviews.map(reviewMapper::toReviewResponse);
    }

    public Page<ReviewResponse> getReviewsByReviewer(String reviewerUsername, Pageable pageable) {
        Page<Review> reviews = reviewRepository.findReviewsByReviewer(reviewerUsername, pageable);
        return reviews.map(reviewMapper::toReviewResponse);
    }

    @Transactional
    public ReviewResponse updateReview(Long reviewId, String reviewerUsername, ReviewRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new NotFoundException("REVIEW_NOT_FOUND", "Review with ID " + reviewId + " not found."));

        if (!review.getReviewer().getUserName().equals(reviewerUsername)) {
            throw new ForbiddenException("ACCESS_DENIED", "You can only update your own reviews.");
        }

        reviewMapper.updateReviewFromRequest(request, review);

        Review updatedReview = reviewRepository.save(review);
        return reviewMapper.toReviewResponse(updatedReview);
    }

    @Transactional
    public void deleteReview(Long reviewId, String reviewerUsername) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new NotFoundException("REVIEW_NOT_FOUND", "Review with ID " + reviewId + " not found."));

        if (!review.getReviewer().getUserName().equals(reviewerUsername)) {
            throw new ForbiddenException("ACCESS_DENIED", "You can only delete your own reviews.");
        }

        reviewRepository.delete(review);
    }

    public Double getAverageRatingForUser(String username) {
        return reviewRepository.calculateAverageRatingForUser(username);
    }
}
