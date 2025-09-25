package com.jttam.glig.domain.employerprofile.dto;

import com.jttam.glig.domain.employerprofile.EmployerType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreateEmployerProfileRequest {

    @NotNull(message = "User ID cannot be null")
    private String userId;

    @NotNull(message = "Employer type cannot be null")
    private EmployerType employerType;

    @Size(max = 255, message = "Street address cannot exceed 255 characters")
    private String streetAddress;

    @Size(max = 255, message = "Postal code cannot exceed 255 characters")
    private String postalCode;

    @NotBlank(message = "City cannot be blank")
    @Size(max = 255, message = "City cannot exceed 255 characters")
    private String city;

    @NotBlank(message = "Country cannot be blank")
    @Size(max = 255, message = "Country cannot exceed 255 characters")
    private String country;

    @Size(max = 5000, message = "Bio cannot exceed 5000 characters")
    private String bio;

    @Size(max = 255, message = "Company name cannot exceed 255 characters")
    private String companyName;

    private String businessId;

    @Size(max = 2048, message = "Website link is too long")
    private String websiteLink;

    @Size(max = 2048, message = "Profile image URL is too long")
    private String profileImageUrl;

    // --- Note ---
    // No employerProfileId, isVerified, createdAt, or updatedAt.
    // The server will handle generating these values.

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
}