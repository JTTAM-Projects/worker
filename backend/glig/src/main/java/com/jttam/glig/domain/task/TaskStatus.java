package com.jttam.glig.domain.task;

public enum TaskStatus {
    ACTIVE("Task that is waiting for applications from workers"),
    IN_PROGRESS("Employer has accepted workers application"),
    PENDING_APPROVAL("Pending employers approval"),
    COMPLETED("Completed task that employer has accepted"),
    CANCELLED("Employer or worker has cancelled task"),
    EXPIRED("Expired due to time limit etc.");

    private final String displayName;

    TaskStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
