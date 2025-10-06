package com.jttam.glig.review;

import com.jttam.glig.review.dto.ReviewRequest;
import com.jttam.glig.review.dto.ReviewResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for managing reviews.
 * Handles CRUD operations and queries for task reviews.
 */
@RestController
@RequestMapping("/api/v1/reviews")
@Tag(name = "Review", description = "Operations related to task reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @Operation(summary = "Create a new review", description = "Creates a review for a completed task. Only task participants (employer or accepted tasker) can create reviews.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Review created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid review data provided"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Not authorized to review this task"),
            @ApiResponse(responseCode = "404", description = "Task or user not found"),
            @ApiResponse(responseCode = "409", description = "Review already exists")
    })
    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        String reviewerUsername = jwt.getSubject();
        ReviewResponse response = reviewService.createReview(request, reviewerUsername);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Get reviews for a tasker profile", description = "Fetches all reviews where the specified user was reviewed as a tasker (task performer).")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Reviews fetched successfully")
    })
    @GetMapping("/tasker/{username}")
    public ResponseEntity<Page<ReviewResponse>> getReviewsForTaskerProfile(
            @PathVariable String username,
            @PageableDefault(size = 10, page = 0, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<ReviewResponse> reviews = reviewService.getReviewsForTaskerProfile(username, pageable);
        return ResponseEntity.ok(reviews);
    }

    @Operation(summary = "Get reviews for an employer profile", description = "Fetches all reviews where the specified user was reviewed as an employer (task creator).")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Reviews fetched successfully")
    })
    @GetMapping("/employer/{username}")
    public ResponseEntity<Page<ReviewResponse>> getReviewsForEmployerProfile(
            @PathVariable String username,
            @PageableDefault(size = 10, page = 0, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<ReviewResponse> reviews = reviewService.getReviewsForEmployerProfile(username, pageable);
        return ResponseEntity.ok(reviews);
    }

    @Operation(summary = "Get reviews by reviewer", description = "Fetches all reviews written by the specified user.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Reviews fetched successfully")
    })
    @GetMapping("/reviewer/{username}")
    public ResponseEntity<Page<ReviewResponse>> getReviewsByReviewer(
            @PathVariable String username,
            @PageableDefault(size = 10, page = 0, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<ReviewResponse> reviews = reviewService.getReviewsByReviewer(username, pageable);
        return ResponseEntity.ok(reviews);
    }

    @Operation(summary = "Get average rating for a user", description = "Calculates the average rating received by the specified user across all their reviews.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Average rating calculated successfully"),
            @ApiResponse(responseCode = "204", description = "No reviews found for user")
    })
    @GetMapping("/average/{username}")
    public ResponseEntity<Double> getAverageRating(@PathVariable String username) {
        Double averageRating = reviewService.getAverageRatingForUser(username);
        if (averageRating == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(averageRating);
    }

    @Operation(summary = "Update a review", description = "Updates an existing review. Only the review author can update their review.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Review updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid review data provided"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Not authorized to update this review"),
            @ApiResponse(responseCode = "404", description = "Review not found")
    })
    @PutMapping("/{reviewId}")
    public ResponseEntity<ReviewResponse> updateReview(
            @PathVariable Long reviewId,
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        String reviewerUsername = jwt.getSubject();
        ReviewResponse response = reviewService.updateReview(reviewId, reviewerUsername, request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Delete a review", description = "Deletes an existing review. Only the review author can delete their review.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Review deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Not authorized to delete this review"),
            @ApiResponse(responseCode = "404", description = "Review not found")
    })
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal Jwt jwt) {
        String reviewerUsername = jwt.getSubject();
        reviewService.deleteReview(reviewId, reviewerUsername);
        return ResponseEntity.noContent().build();
    }
}
