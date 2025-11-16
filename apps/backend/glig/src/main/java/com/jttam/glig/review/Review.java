package com.jttam.glig.review;

import com.jttam.glig.domain.common.baseClass;
import com.jttam.glig.domain.task.Task;
import com.jttam.glig.domain.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.Check;

@Entity
// Prevents a user from reviewing the same task more than once.
@Table(name = "reviews", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"task_id", "reviewer_id"})
})

@Check(constraints = "rating >= 1 AND rating <= 5 AND reviewer_id <> reviewee_id")
public class Review extends baseClass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private User reviewer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewee_id", nullable = false)
    private User reviewee;

    // Validation annotations.
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    @Column(name = "rating", nullable = false)
    private int rating;

    @Size(max = 1000, message = "Comment must not exceed 1000 characters")
    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;

    public Review() {
    }

    public Review(Task task, User reviewer, User reviewee, int rating, String comment) {
        this.task = task;
        this.reviewer = reviewer;
        this.reviewee = reviewee;
        this.rating = rating;
        this.comment = comment;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    public User getReviewer() {
        return reviewer;
    }

    public void setReviewer(User reviewer) {
        this.reviewer = reviewer;
    }

    public User getReviewee() {
        return reviewee;
    }

    public void setReviewee(User reviewee) {
        this.reviewee = reviewee;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    @Override
    public String toString() {
        return "Review{" +
            "id=" + id +
            ", rating=" + rating +
            ", comment='" + (comment != null ? comment.substring(0, Math.min(comment.length(), 20)) + "..." : "null") + '\'' +
            '}';
    }
}
