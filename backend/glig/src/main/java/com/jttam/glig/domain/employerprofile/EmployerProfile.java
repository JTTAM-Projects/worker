package com.jttam.glig.domain.employerprofile;

import java.io.Serializable;
import java.time.Instant;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.Where;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;

@Entity
@Table(name = "employer_profile")
@Where(clause = "status = 'ACTIVE'")
public class EmployerProfile implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employer_profile_id")
    private Long employerProfileId;

    // A profile must belong to a user.
    @Column(name = "user_id", unique = true, nullable = false)
    private String userId;

    // A profile must have a type.
    @Enumerated(EnumType.STRING)
    @Column(name = "employer_type", nullable = false)
    private EmployerType employerType;

    @Column(name = "location_id")
    private Integer locationId;

    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "business_id")
    private String businessId;

    @Column(name = "website_link", length = 2048)
    private String websiteLink;

    @Column(name = "profile_image_url", length = 2048)
    private String profileImageUrl;

    @Column(name = "is_verified", nullable = false)
    private boolean isVerified = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ProfileStatus status = ProfileStatus.ACTIVE;

    public Long getEmployerProfileId() {
        return employerProfileId;
    }

    public void setEmployerProfileId(Long employerProfileId) {
        this.employerProfileId = employerProfileId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public EmployerType getEmployerType() {
        return employerType;
    }

    public void setEmployerType(EmployerType employerType) {
        this.employerType = employerType;
    }

    public Integer getLocationId() {
        return locationId;
    }

    public void setLocationId(Integer locationId) {
        this.locationId = locationId;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getBusinessId() {
        return businessId;
    }

    public void setBusinessId(String businessId) {
        this.businessId = businessId;
    }

    public String getWebsiteLink() {
        return websiteLink;
    }

    public void setWebsiteLink(String websiteLink) {
        this.websiteLink = websiteLink;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    public boolean isVerified() {
        return isVerified;
    }

    public void setVerified(boolean isVerified) {
        this.isVerified = isVerified;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public ProfileStatus getStatus() {
        return status;
    }

    public void setStatus(ProfileStatus status) {
        this.status = status;
    }
}
