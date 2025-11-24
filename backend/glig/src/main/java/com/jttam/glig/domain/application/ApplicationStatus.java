package com.jttam.glig.domain.application;

public enum ApplicationStatus {
    PENDING("Application pending and waiting accept from employer"),
    ACCEPTED("Application accepted by employer"),
    REJECTED("Application rejected by employer"),
    CANCELLED("Worker canceled apply");

    private final String displayName;

    private ApplicationStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
