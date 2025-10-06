package com.jttam.glig.review;

import com.jttam.glig.domain.application.Application;
import com.jttam.glig.domain.application.ApplicationRepository;
import com.jttam.glig.domain.application.ApplicationStatus;
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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private ReviewMapper reviewMapper;

    @InjectMocks
    private ReviewService reviewService;

    private User employer;
    private User tasker;
    private User randomUser;
    private Task completedTask;
    private Task activeTask;
    private Application acceptedApplication;
    private Review review;
    private ReviewRequest reviewRequest;
    private ReviewResponse reviewResponse;

    @BeforeEach
    void setUp() {
        employer = new User();
        employer.setUserName("employer123");

        tasker = new User();
        tasker.setUserName("tasker456");

        randomUser = new User();
        randomUser.setUserName("random789");

        completedTask = new Task();
        completedTask.setId(1L);
        completedTask.setTitle("Test Task");
        completedTask.setStatus(TaskStatus.COMPLETED);
        completedTask.setUser(employer);

        activeTask = new Task();
        activeTask.setId(2L);
        activeTask.setTitle("Active Task");
        activeTask.setStatus(TaskStatus.ACTIVE);
        activeTask.setUser(employer);

        acceptedApplication = new Application();
        acceptedApplication.setUser(tasker);
        acceptedApplication.setTask(completedTask);
        acceptedApplication.setApplicationStatus(ApplicationStatus.ACCEPTED);

        review = new Review();
        review.setId(1L);
        review.setTask(completedTask);
        review.setReviewer(employer);
        review.setReviewee(tasker);
        review.setRating(5);
        review.setComment("Great work!");

        reviewRequest = new ReviewRequest(
            1L,
            "tasker456",
            5,
            "Great work!"
        );

        reviewResponse = new ReviewResponse(
            1L,
            1L,
            "Test Task",
            "employer123",
            "tasker456",
            5,
            "Great work!",
            Instant.now(),
            Instant.now()
        );
    }

    @Test
    void createReview_employerReviewsTasker_success() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(completedTask));
        when(reviewRepository.existsByTask_IdAndReviewer_UserName(1L, "employer123")).thenReturn(false);
        when(applicationRepository.findAcceptedApplicationForTask(1L)).thenReturn(Optional.of(acceptedApplication));
        when(userRepository.findByUserName("employer123")).thenReturn(Optional.of(employer));
        when(userRepository.findByUserName("tasker456")).thenReturn(Optional.of(tasker));
        when(reviewMapper.toReviewEntity(any(ReviewRequest.class))).thenReturn(review);
        when(reviewRepository.save(any(Review.class))).thenReturn(review);
        when(reviewMapper.toReviewResponse(any(Review.class))).thenReturn(reviewResponse);

        ReviewResponse result = reviewService.createReview(reviewRequest, "employer123");

        assertNotNull(result);
        assertEquals(5, result.rating());
        assertEquals("Great work!", result.comment());
        verify(reviewRepository).save(any(Review.class));
        verify(reviewMapper).toReviewEntity(reviewRequest);
        verify(reviewMapper).toReviewResponse(review);
    }

    @Test
    void createReview_taskerReviewsEmployer_success() {
        ReviewRequest taskerReviewRequest = new ReviewRequest(1L, "employer123", 4, "Good employer");
        
        when(taskRepository.findById(1L)).thenReturn(Optional.of(completedTask));
        when(reviewRepository.existsByTask_IdAndReviewer_UserName(1L, "tasker456")).thenReturn(false);
        when(applicationRepository.findAcceptedApplicationForTask(1L)).thenReturn(Optional.of(acceptedApplication));
        when(userRepository.findByUserName("tasker456")).thenReturn(Optional.of(tasker));
        when(userRepository.findByUserName("employer123")).thenReturn(Optional.of(employer));
        when(reviewMapper.toReviewEntity(any(ReviewRequest.class))).thenReturn(review);
        when(reviewRepository.save(any(Review.class))).thenReturn(review);
        when(reviewMapper.toReviewResponse(any(Review.class))).thenReturn(reviewResponse);

        ReviewResponse result = reviewService.createReview(taskerReviewRequest, "tasker456");

        assertNotNull(result);
        verify(reviewRepository).save(any(Review.class));
    }

    @Test
    void createReview_taskNotFound_throwsNotFoundException() {
        when(taskRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> {
            reviewService.createReview(reviewRequest, "employer123");
        });

        verify(reviewRepository, never()).save(any(Review.class));
    }

    @Test
    void createReview_taskNotCompleted_throwsForbiddenException() {
        when(taskRepository.findById(2L)).thenReturn(Optional.of(activeTask));

        ReviewRequest activeTaskRequest = new ReviewRequest(2L, "tasker456", 5, "Test");

        assertThrows(ForbiddenException.class, () -> {
            reviewService.createReview(activeTaskRequest, "employer123");
        });

        verify(reviewRepository, never()).save(any(Review.class));
    }

    @Test
    void createReview_duplicateReview_throwsConflictException() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(completedTask));
        when(reviewRepository.existsByTask_IdAndReviewer_UserName(1L, "employer123")).thenReturn(true);

        assertThrows(ConflictException.class, () -> {
            reviewService.createReview(reviewRequest, "employer123");
        });

        verify(reviewRepository, never()).save(any(Review.class));
    }

    @Test
    void createReview_noAcceptedTasker_throwsForbiddenException() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(completedTask));
        when(reviewRepository.existsByTask_IdAndReviewer_UserName(1L, "employer123")).thenReturn(false);
        when(applicationRepository.findAcceptedApplicationForTask(1L)).thenReturn(Optional.empty());

        assertThrows(ForbiddenException.class, () -> {
            reviewService.createReview(reviewRequest, "employer123");
        });

        verify(reviewRepository, never()).save(any(Review.class));
    }

    @Test
    void createReview_reviewerNotFound_throwsNotFoundException() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(completedTask));
        when(reviewRepository.existsByTask_IdAndReviewer_UserName(1L, "employer123")).thenReturn(false);
        when(applicationRepository.findAcceptedApplicationForTask(1L)).thenReturn(Optional.of(acceptedApplication));
        when(userRepository.findByUserName("employer123")).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> {
            reviewService.createReview(reviewRequest, "employer123");
        });

        verify(reviewRepository, never()).save(any(Review.class));
    }

    @Test
    void createReview_revieweeNotFound_throwsNotFoundException() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(completedTask));
        when(reviewRepository.existsByTask_IdAndReviewer_UserName(1L, "employer123")).thenReturn(false);
        when(applicationRepository.findAcceptedApplicationForTask(1L)).thenReturn(Optional.of(acceptedApplication));
        when(userRepository.findByUserName("employer123")).thenReturn(Optional.of(employer));
        when(userRepository.findByUserName("tasker456")).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> {
            reviewService.createReview(reviewRequest, "employer123");
        });

        verify(reviewRepository, never()).save(any(Review.class));
    }

    @Test
    void createReview_invalidParties_throwsForbiddenException() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(completedTask));
        when(reviewRepository.existsByTask_IdAndReviewer_UserName(1L, "random789")).thenReturn(false);
        when(applicationRepository.findAcceptedApplicationForTask(1L)).thenReturn(Optional.of(acceptedApplication));
        when(userRepository.findByUserName("random789")).thenReturn(Optional.of(randomUser));
        when(userRepository.findByUserName("tasker456")).thenReturn(Optional.of(tasker));

        assertThrows(ForbiddenException.class, () -> {
            reviewService.createReview(reviewRequest, "random789");
        });

        verify(reviewRepository, never()).save(any(Review.class));
    }

    @Test
    void getReviewsForTaskerProfile_returnsPageOfReviews() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Review> reviewPage = new PageImpl<>(List.of(review));
        
        when(reviewRepository.findTaskerReviewsForUser("tasker456", pageable)).thenReturn(reviewPage);
        when(reviewMapper.toReviewResponse(any(Review.class))).thenReturn(reviewResponse);

        Page<ReviewResponse> result = reviewService.getReviewsForTaskerProfile("tasker456", pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(reviewRepository).findTaskerReviewsForUser("tasker456", pageable);
        verify(reviewMapper, times(1)).toReviewResponse(any(Review.class));
    }

    @Test
    void getReviewsForEmployerProfile_returnsPageOfReviews() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Review> reviewPage = new PageImpl<>(List.of(review));
        
        when(reviewRepository.findEmployerReviewsForUser("employer123", pageable)).thenReturn(reviewPage);
        when(reviewMapper.toReviewResponse(any(Review.class))).thenReturn(reviewResponse);

        Page<ReviewResponse> result = reviewService.getReviewsForEmployerProfile("employer123", pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(reviewRepository).findEmployerReviewsForUser("employer123", pageable);
        verify(reviewMapper, times(1)).toReviewResponse(any(Review.class));
    }

    @Test
    void getReviewsByReviewer_returnsPageOfReviews() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Review> reviewPage = new PageImpl<>(List.of(review));
        
        when(reviewRepository.findReviewsByReviewer("employer123", pageable)).thenReturn(reviewPage);
        when(reviewMapper.toReviewResponse(any(Review.class))).thenReturn(reviewResponse);

        Page<ReviewResponse> result = reviewService.getReviewsByReviewer("employer123", pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(reviewRepository).findReviewsByReviewer("employer123", pageable);
        verify(reviewMapper, times(1)).toReviewResponse(any(Review.class));
    }

    @Test
    void updateReview_success() {
        ReviewRequest updateRequest = new ReviewRequest(1L, "tasker456", 4, "Updated comment");
        
        when(reviewRepository.findById(1L)).thenReturn(Optional.of(review));
        when(reviewRepository.save(any(Review.class))).thenReturn(review);
        when(reviewMapper.toReviewResponse(any(Review.class))).thenReturn(reviewResponse);

        ReviewResponse result = reviewService.updateReview(1L, "employer123", updateRequest);

        assertNotNull(result);
        verify(reviewMapper).updateReviewFromRequest(updateRequest, review);
        verify(reviewRepository).save(review);
    }

    @Test
    void updateReview_reviewNotFound_throwsNotFoundException() {
        ReviewRequest updateRequest = new ReviewRequest(1L, "tasker456", 4, "Updated comment");
        
        when(reviewRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> {
            reviewService.updateReview(1L, "employer123", updateRequest);
        });

        verify(reviewRepository, never()).save(any(Review.class));
    }

    @Test
    void updateReview_notAuthor_throwsForbiddenException() {
        ReviewRequest updateRequest = new ReviewRequest(1L, "tasker456", 4, "Updated comment");
        
        when(reviewRepository.findById(1L)).thenReturn(Optional.of(review));

        assertThrows(ForbiddenException.class, () -> {
            reviewService.updateReview(1L, "random789", updateRequest);
        });

        verify(reviewRepository, never()).save(any(Review.class));
    }

    @Test
    void deleteReview_success() {
        when(reviewRepository.findById(1L)).thenReturn(Optional.of(review));

        reviewService.deleteReview(1L, "employer123");

        verify(reviewRepository).delete(review);
    }

    @Test
    void deleteReview_reviewNotFound_throwsNotFoundException() {
        when(reviewRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> {
            reviewService.deleteReview(1L, "employer123");
        });

        verify(reviewRepository, never()).delete(any(Review.class));
    }

    @Test
    void deleteReview_notAuthor_throwsForbiddenException() {
        when(reviewRepository.findById(1L)).thenReturn(Optional.of(review));

        assertThrows(ForbiddenException.class, () -> {
            reviewService.deleteReview(1L, "random789");
        });

        verify(reviewRepository, never()).delete(any(Review.class));
    }

    @Test
    void getAverageRatingForUser_returnsAverageRating() {
        when(reviewRepository.calculateAverageRatingForUser("tasker456")).thenReturn(4.5);

        Double result = reviewService.getAverageRatingForUser("tasker456");

        assertNotNull(result);
        assertEquals(4.5, result);
        verify(reviewRepository).calculateAverageRatingForUser("tasker456");
    }

    @Test
    void getAverageRatingForUser_noReviews_returnsNull() {
        when(reviewRepository.calculateAverageRatingForUser("tasker456")).thenReturn(null);

        Double result = reviewService.getAverageRatingForUser("tasker456");

        assertNull(result);
        verify(reviewRepository).calculateAverageRatingForUser("tasker456");
    }
}
