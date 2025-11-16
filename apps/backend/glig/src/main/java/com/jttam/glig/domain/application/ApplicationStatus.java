package com.jttam.glig.domain.application;

public enum ApplicationStatus {
    PENDING("Application pending"),
    ACCEPTED("Application accepted"),
    REJECTED("Application rejected"),
    CANCELLED("Worker canceled apply"),
    IN_PROGRESS("Application in progress"),
    COMPLETED("Application completed"),
    CONFIRMED("Application confirmed");

    private final String displayName;

    private ApplicationStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
