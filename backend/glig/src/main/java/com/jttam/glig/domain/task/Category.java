package com.jttam.glig.domain.task;

public enum Category {
    GARDEN("Garden"),
    YARD("Yard"),
    FORESTWORK("Forest work"),
    HOUSEHOLD("Household"),
    CLEANING("Cleaning"),
    MOVING("Moving"),
    REPAIR("Repair"),
    PAINTING("Painting"),
    SNOW_REMOVAL("Snow removal"),
    OTHER("Other");

    private final String displayName;

    Category(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
