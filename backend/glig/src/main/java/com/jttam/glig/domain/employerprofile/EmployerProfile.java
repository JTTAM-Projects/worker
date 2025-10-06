package com.jttam.glig.domain.employerprofile;

import org.hibernate.annotations.Where;

import com.jttam.glig.domain.common.BaseProfile;
import com.jttam.glig.domain.user.User;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.Id;

@Entity
@Table(name = "employer_profile")
@Where(clause = "status = 'ACTIVE'")
public class EmployerProfile extends BaseProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employer_profile_id")
    private Long employerProfileId;

    @Enumerated(EnumType.STRING)
    @Column(name = "employer_type", nullable = false)
    private EmployerType employerType;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "business_id")
    private String businessId;

    public EmployerProfile() {
        super();
    }

    public EmployerProfile(User user, EmployerType employerType, String streetAddress, String postalCode,
            String city, String country, String bio, String companyName, String businessId, String websiteLink,
            String profileImageUrl, boolean isVerified) {
        super(user, streetAddress, postalCode, city, country, bio, websiteLink, profileImageUrl, isVerified);
        this.employerType = employerType;
        this.companyName = companyName;
        this.businessId = businessId;
    }

     // Getters and setters

    public Long getEmployerProfileId() {
        return employerProfileId;
    }

    public void setEmployerProfileId(Long employerProfileId) {
        this.employerProfileId = employerProfileId;
    }

    public EmployerType getEmployerType() {
        return employerType;
    }

    public void setEmployerType(EmployerType employerType) {
        this.employerType = employerType;
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
}
