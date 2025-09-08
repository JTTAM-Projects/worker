package com.jttam.glig.domain.apply;

public enum ApplyStatus {
    PENDING("Application pending"),
    ACCEPTED("Application accepted"),
    REJECTED("Application rejected"),
    CANCELLED("Worker canceled apply");

    private final String displayName;

    private ApplyStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

}
