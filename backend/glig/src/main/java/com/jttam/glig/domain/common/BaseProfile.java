package com.jttam.glig.domain.common;

import com.jttam.glig.domain.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.validator.constraints.URL;

import java.io.Serializable;
import java.time.Instant;

/**
 * An abstract base class for user profiles (Tasker, Employer).
 * It contains all common fields, including address, audit timestamps, and status.
 * This class is not an entity itself but its mappings are inherited by subclasses.
 */
@MappedSuperclass
public abstract class BaseProfile implements Serializable {

    @NotNull(message = "User cannot be null.")
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true, updatable = false)
    private User user;

    @NotBlank(message = "First name cannot be blank.")
    @Size(max = 100, message = "First name must be less than 100 characters.")
    @Column(name = "first_name")
    private String firstName;

    @NotBlank(message = "Last name cannot be blank.")
    @Size(max = 100, message = "Last name must be less than 100 characters.")
    @Column(name = "last_name")
    private String lastName;

    @Size(max = 5000, message = "Bio must be less than 5000 characters.")
    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;

    @Size(max = 255, message = "Street address must be less than 255 characters.")
    @Column(name = "street_address")
    private String streetAddress;

    @Size(max = 40, message = "Postal code must be less than 40 characters.")
    @Column(name = "postal_code")
    private String postalCode;

    @Size(max = 100, message = "City must be less than 100 characters.")
    @Column(name = "city")
    private String city;

    @Size(max = 100, message = "Country must be less than 100 characters.")
    @Column(name = "country")
    private String country;

    @URL(message = "Website link must be a valid URL.")
    @Size(max = 2048, message = "Website link must be less than 2048 characters.")
    @Column(name = "website_link", length = 2048)
    private String websiteLink;

    @URL(message = "Profile image URL must be a valid URL.")
    @Size(max = 2048, message = "Profile image URL must be less than 2048 characters.")
    @Column(name = "profile_image_url", length = 2048)
    private String profileImageUrl;

    @Column(name = "is_verified", nullable = false)
    private boolean isVerified = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ProfileStatus status = ProfileStatus.ACTIVE;

    // --- Timestamps for auditing ---

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    // --- Constructors ---

    /**
     * Protected no-argument constructor for JPA.
     */
    protected BaseProfile() {
    }

    public BaseProfile(User user, String streetAddress, String postalCode, String city, String country, String bio, String websiteLink, String profileImageUrl, boolean isVerified) {
        this.user = user;
        this.streetAddress = streetAddress;
        this.postalCode = postalCode;
        this.city = city;
        this.country = country;
        this.bio = bio;
        this.websiteLink = websiteLink;
        this.profileImageUrl = profileImageUrl;
        this.isVerified = isVerified;
    }

    // --- Getters and Setters ---

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
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

    public ProfileStatus getStatus() {
        return status;
    }

    public void setStatus(ProfileStatus status) {
        this.status = status;
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

    public Instant getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(Instant deletedAt) {
        this.deletedAt = deletedAt;
    }
}