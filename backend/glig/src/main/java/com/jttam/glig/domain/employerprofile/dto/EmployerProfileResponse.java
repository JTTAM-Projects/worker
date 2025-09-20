package com.jttam.glig.domain.employerprofile.dto;

import java.time.Instant;
import com.jttam.glig.domain.employerprofile.EmployerType;

public class EmployerProfileResponse {

    private Long employerProfileId;
    private String userId;
    private EmployerType employerType;
    private Integer locationId;
    private String bio;
    private String companyName;
    private String businessId;
    private String websiteLink;
    private String profileImageUrl;
    private boolean isVerified;
    private Instant createdAt;
    private Instant updatedAt;

    public EmployerProfileResponse() {
    }

    public EmployerProfileResponse(Long employerProfileId, String userId, EmployerType employerType, Integer locationId, String bio, String companyName, String businessId, String websiteLink, String profileImageUrl, boolean isVerified, Instant createdAt, Instant updatedAt) {
        this.employerProfileId = employerProfileId;
        this.userId = userId;
        this.employerType = employerType;
        this.locationId = locationId;
        this.bio = bio;
        this.companyName = companyName;
        this.businessId = businessId;
        this.websiteLink = websiteLink;
        this.profileImageUrl = profileImageUrl;
        this.isVerified = isVerified;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

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

    
}