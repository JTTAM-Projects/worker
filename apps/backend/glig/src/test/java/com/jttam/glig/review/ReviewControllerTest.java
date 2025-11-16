package com.jttam.glig.review;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jttam.glig.exception.custom.ConflictException;
import com.jttam.glig.exception.custom.ForbiddenException;
import com.jttam.glig.exception.custom.NotFoundException;
import com.jttam.glig.review.dto.ReviewRequest;
import com.jttam.glig.review.dto.ReviewResponse;
import com.jttam.glig.testdata.TestDataService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ReviewController.class)
class ReviewControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ReviewService reviewService;

    @MockBean
    private TestDataService testDataService;

    private ReviewResponse reviewResponse;
    private ReviewRequest reviewRequest;
    private Jwt jwt;

    private static final String REVIEWER_USERNAME = "user1";
    private static final String REVIEWEE_USERNAME = "user2";

    @BeforeEach
    void setUp() {
        reviewResponse = new ReviewResponse(
            1L,
            1L,
            "Test Task",
            REVIEWER_USERNAME,
            REVIEWEE_USERNAME,
            5,
            "Excellent work!",
            Instant.now(),
            Instant.now()
        );

        reviewRequest = new ReviewRequest(
            1L,
            REVIEWEE_USERNAME,
            5,
            "Excellent work!"
        );

        jwt = Jwt.withTokenValue("token")
                .header("alg", "none")
                .claim("sub", REVIEWER_USERNAME)
                .build();
    }

    @Test
    void createReview_shouldReturnCreatedReview_whenValid() throws Exception {
        given(reviewService.createReview(eq(REVIEWER_USERNAME), any(ReviewRequest.class)))
                .willReturn(reviewResponse);

        mockMvc.perform(post("/api/reviews")
                .with(jwt().jwt(jwt))
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reviewRequest)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.rating").value(5))
                .andExpect(jsonPath("$.comment").value("Excellent work!"))
                .andExpect(jsonPath("$.reviewerUsername").value(REVIEWER_USERNAME))
                .andExpect(jsonPath("$.revieweeUsername").value(REVIEWEE_USERNAME));

        verify(reviewService).createReview(eq(REVIEWER_USERNAME), any(ReviewRequest.class));
    }

    @Test
    void createReview_shouldReturnBadRequest_whenRequestInvalid() throws Exception {
        ReviewRequest invalidRequest = new ReviewRequest(null, null, null, null);

        mockMvc.perform(post("/api/reviews")
                .with(jwt().jwt(jwt))
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());

        verify(reviewService, never()).createReview(anyString(), any(ReviewRequest.class));
    }

    @Test
    void createReview_shouldReturnNotFound_whenTaskNotFound() throws Exception {
        given(reviewService.createReview(eq(REVIEWER_USERNAME), any(ReviewRequest.class)))
                .willThrow(new NotFoundException("TASK_NOT_FOUND", "Task not found"));

        mockMvc.perform(post("/api/reviews")
                .with(jwt().jwt(jwt))
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reviewRequest)))
                .andExpect(status().isNotFound());
    }

    @Test
    void createReview_shouldReturnForbidden_whenTaskNotCompleted() throws Exception {
        given(reviewService.createReview(eq(REVIEWER_USERNAME), any(ReviewRequest.class)))
                .willThrow(new ForbiddenException("TASK_NOT_COMPLETED", "Task not completed"));

        mockMvc.perform(post("/api/reviews")
                .with(jwt().jwt(jwt))
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reviewRequest)))
                .andExpect(status().isForbidden());
    }

    @Test
    void createReview_shouldReturnConflict_whenReviewAlreadyExists() throws Exception {
        given(reviewService.createReview(eq(REVIEWER_USERNAME), any(ReviewRequest.class)))
                .willThrow(new ConflictException("REVIEW_ALREADY_EXISTS", "Review already exists"));

        mockMvc.perform(post("/api/reviews")
                .with(jwt().jwt(jwt))
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reviewRequest)))
                .andExpect(status().isConflict());
    }

    @Test
    void getReviewsForTaskerProfile_shouldReturnPageOfReviews() throws Exception {
        Page<ReviewResponse> reviewPage = new PageImpl<>(List.of(reviewResponse), PageRequest.of(0, 10), 1);
        given(reviewService.getReviewsForTaskerProfile(eq("tasker1"), any(Pageable.class)))
                .willReturn(reviewPage);

        mockMvc.perform(get("/api/reviews/tasker/tasker1")
                .with(jwt().jwt(jwt))
                .param("page", "0")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content[0].rating").value(5))
                .andExpect(jsonPath("$.content[0].comment").value("Excellent work!"))
                .andExpect(jsonPath("$.totalElements").value(1));

        verify(reviewService).getReviewsForTaskerProfile(eq("tasker1"), any(Pageable.class));
    }

    @Test
    void getReviewsForEmployerProfile_shouldReturnPageOfReviews() throws Exception {
        Page<ReviewResponse> reviewPage = new PageImpl<>(List.of(reviewResponse), PageRequest.of(0, 10), 1);
        given(reviewService.getReviewsForEmployerProfile(eq("employer1"), any(Pageable.class)))
                .willReturn(reviewPage);

        mockMvc.perform(get("/api/reviews/employer/employer1")
                .with(jwt().jwt(jwt))
                .param("page", "0")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content[0].rating").value(5))
                .andExpect(jsonPath("$.totalElements").value(1));

        verify(reviewService).getReviewsForEmployerProfile(eq("employer1"), any(Pageable.class));
    }

    @Test
    void getReviewsByReviewer_shouldReturnPageOfReviews() throws Exception {
        Page<ReviewResponse> reviewPage = new PageImpl<>(List.of(reviewResponse), PageRequest.of(0, 10), 1);
        given(reviewService.getReviewsByReviewer(eq(REVIEWER_USERNAME), any(Pageable.class)))
                .willReturn(reviewPage);

        mockMvc.perform(get("/api/reviews/reviewer/" + REVIEWER_USERNAME)
                .with(jwt().jwt(jwt))
                .param("page", "0")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content[0].reviewerUsername").value(REVIEWER_USERNAME))
                .andExpect(jsonPath("$.totalElements").value(1));

        verify(reviewService).getReviewsByReviewer(eq(REVIEWER_USERNAME), any(Pageable.class));
    }

    @Test
    void getAverageRating_shouldReturnAverageRating_whenReviewsExist() throws Exception {
        given(reviewService.getAverageRatingForUser("user1")).willReturn(4.5);

        mockMvc.perform(get("/api/reviews/average/user1")
                .with(jwt().jwt(jwt)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").value(4.5));

        verify(reviewService).getAverageRatingForUser("user1");
    }

    @Test
    void getAverageRating_shouldReturnNoContent_whenNoReviews() throws Exception {
        given(reviewService.getAverageRatingForUser("user1")).willReturn(null);

        mockMvc.perform(get("/api/reviews/average/user1")
                .with(jwt().jwt(jwt)))
                .andExpect(status().isNoContent());

        verify(reviewService).getAverageRatingForUser("user1");
    }

    @Test
    void updateReview_shouldReturnUpdatedReview_whenValid() throws Exception {
        ReviewRequest updateRequest = new ReviewRequest(1L, REVIEWEE_USERNAME, 4, "Updated comment");
        ReviewResponse updatedResponse = new ReviewResponse(
            1L, 1L, "Test Task", REVIEWER_USERNAME, REVIEWEE_USERNAME, 4, "Updated comment",
            Instant.now(), Instant.now()
        );

        given(reviewService.updateReview(eq(1L), eq(REVIEWER_USERNAME), any(ReviewRequest.class)))
                .willReturn(updatedResponse);

        mockMvc.perform(put("/api/reviews/1")
                .with(jwt().jwt(jwt))
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.rating").value(4))
                .andExpect(jsonPath("$.comment").value("Updated comment"));

        verify(reviewService).updateReview(eq(1L), eq(REVIEWER_USERNAME), any(ReviewRequest.class));
    }

    @Test
    void updateReview_shouldReturnNotFound_whenReviewNotFound() throws Exception {
        given(reviewService.updateReview(eq(999L), eq(REVIEWER_USERNAME), any(ReviewRequest.class)))
                .willThrow(new NotFoundException("REVIEW_NOT_FOUND", "Review not found"));

        mockMvc.perform(put("/api/reviews/999")
                .with(jwt().jwt(jwt))
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reviewRequest)))
                .andExpect(status().isNotFound());
    }

    @Test
    void updateReview_shouldReturnForbidden_whenNotAuthor() throws Exception {
        given(reviewService.updateReview(eq(1L), eq(REVIEWER_USERNAME), any(ReviewRequest.class)))
                .willThrow(new ForbiddenException("ACCESS_DENIED", "Not the review author"));

        mockMvc.perform(put("/api/reviews/1")
                .with(jwt().jwt(jwt))
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reviewRequest)))
                .andExpect(status().isForbidden());
    }

    @Test
    void deleteReview_shouldReturnNoContent_whenSuccessful() throws Exception {
        doNothing().when(reviewService).deleteReview(1L, REVIEWER_USERNAME);

        mockMvc.perform(delete("/api/reviews/1")
                .with(jwt().jwt(jwt))
                .with(csrf()))
                .andExpect(status().isNoContent());

        verify(reviewService).deleteReview(1L, REVIEWER_USERNAME);
    }

    @Test
    void deleteReview_shouldReturnNotFound_whenReviewNotFound() throws Exception {
        doThrow(new NotFoundException("REVIEW_NOT_FOUND", "Review not found"))
                .when(reviewService).deleteReview(999L, REVIEWER_USERNAME);

        mockMvc.perform(delete("/api/reviews/999")
                .with(jwt().jwt(jwt))
                .with(csrf()))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteReview_shouldReturnForbidden_whenNotAuthor() throws Exception {
        doThrow(new ForbiddenException("ACCESS_DENIED", "Not the review author"))
                .when(reviewService).deleteReview(1L, REVIEWER_USERNAME);

        mockMvc.perform(delete("/api/reviews/1")
                .with(jwt().jwt(jwt))
                .with(csrf()))
                .andExpect(status().isForbidden());
    }
}
