package com.jttam.glig.domain.taskerprofile;

import com.jttam.glig.domain.common.BaseProfile;
import com.jttam.glig.domain.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.Where;

import java.math.BigDecimal;

@Entity
@Table(name = "tasker_profile")
@Where(clause = "status = 'ACTIVE'")
public class TaskerProfile extends BaseProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tasker_profile_id")
    private Long taskerProfileId;

    @Column(name = "average_rating", precision = 3, scale = 2)
    private BigDecimal averageRating;

    // Constructors
    public TaskerProfile() {
        super();
    }

    public TaskerProfile(User user, String streetAddress, String postalCode,
            String city, String country, String bio, String websiteLink,
            String profileImageUrl, boolean isVerified, BigDecimal averageRating) {
        super(user, streetAddress, postalCode, city, country, bio, websiteLink, profileImageUrl, isVerified);
        this.averageRating = averageRating;
    }

    // Getters and setters
    public Long getTaskerProfileId() {
        return taskerProfileId;
    }

    public void setTaskerProfileId(Long taskerProfileId) {
        this.taskerProfileId = taskerProfileId;
    }

    public BigDecimal getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(BigDecimal averageRating) {
        this.averageRating = averageRating;
    }
}
