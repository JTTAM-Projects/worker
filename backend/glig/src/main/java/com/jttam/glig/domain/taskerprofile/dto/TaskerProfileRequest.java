package com.jttam.glig.domain.taskerprofile.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.URL;

public class TaskerProfileRequest {
    @NotBlank(message = "First name cannot be blank.")
    @Size(max = 50, message = "First name must be less than 50 characters.")
    private String firstName;
    @NotBlank(message = "Last name cannot be blank.")
    @Size(max = 50, message = "Last name must be less than 50 characters.")
    private String lastName;
    @Size(max = 5000, message = "Bio must be less than 5000 characters.")
    private String bio;
    @Size(max = 255, message = "Street address must be less than 255 characters.")
    private String streetAddress;
    @Size(max = 40, message = "Postal code must be less than 40 characters.")
    private String postalCode;
    @Size(max = 100, message = "City must be less than 100 characters.")
    private String city;
    @Size(max = 100, message = "Country must be less than 100 characters.")
    private String country;
    @URL(message = "Website link must be a valid URL.")
    @Size(max = 2048, message = "Website link must be less than 2048 characters.")
    private String websiteLink;
    @URL(message = "Profile image URL must be a valid URL.")
    @Size(max = 2048, message = "Profile image URL must be less than 2048 characters.")
    private String profileImageUrl;

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
}