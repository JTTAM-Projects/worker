package com.jttam.glig.domain.employerprofile.dto;

import java.time.Instant;
import com.jttam.glig.domain.employerprofile.EmployerType;
import com.jttam.glig.domain.employerprofile.ProfileStatus;

public class EmployerProfileResponse {

    private Long employerProfileId;
    private String userId;
    private EmployerType employerType;
    private String streetAddress;
    private String postalCode;
    private String city;
    private String country;
    private String bio;
    private String companyName;
    private String businessId;
    private String websiteLink;
    private String profileImageUrl;
    private boolean isVerified;
    private Instant createdAt;
    private Instant updatedAt;
    private ProfileStatus status;

    public EmployerProfileResponse() {
    }

    public EmployerProfileResponse(Long employerProfileId, String userId, EmployerType employerType, String streetAddress, String postalCode, String city, String country, String bio, String companyName, String businessId, String websiteLink, String profileImageUrl, boolean isVerified, Instant createdAt, Instant updatedAt, ProfileStatus status) {
        this.employerProfileId = employerProfileId;
        this.userId = userId;
        this.employerType = employerType;
        this.streetAddress = streetAddress;
        this.postalCode = postalCode;
        this.city = city;
        this.country = country;
        this.bio = bio;
        this.companyName = companyName;
        this.businessId = businessId;
        this.websiteLink = websiteLink;
        this.profileImageUrl = profileImageUrl;
        this.isVerified = isVerified;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.status = status;
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

    public String getStreetAddress() {
        return streetAddress;
    }

    public void setStreetAddress(String streetAddress) {
        this.streetAddress = streetAddress;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
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