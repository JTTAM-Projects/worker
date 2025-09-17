package com.jttam.glig.domain.apply;

import java.time.LocalDateTime;

import com.jttam.glig.domain.task.TaskDto;
import com.jttam.glig.domain.user.UserDto;

import jakarta.validation.constraints.NotNull;

public class ApplyDto {

    private UserDto user;
    private TaskDto task;
    @NotNull
    private int priceSuggestion;
    @NotNull
    private LocalDateTime timeSuggestion;
    private String description;
    private ApplyStatus applyStatus;

    public ApplyDto() {
    }

    public ApplyDto(UserDto user, TaskDto task, int priceSuggestion, LocalDateTime timeSuggestion, String description,
            ApplyStatus applyStatus) {
        this.user = user;
        this.task = task;
        this.priceSuggestion = priceSuggestion;
        this.timeSuggestion = timeSuggestion;
        this.description = description;
        this.applyStatus = applyStatus;
    }

    public UserDto getUser() {
        return user;
    }

    public void setUser(UserDto user) {
        this.user = user;
    }

    public TaskDto getTask() {
        return task;
    }

    public void setTask(TaskDto task) {
        this.task = task;
    }

    public int getPriceSuggestion() {
        return priceSuggestion;
    }

    public void setPriceSuggestion(int priceSuggestion) {
        this.priceSuggestion = priceSuggestion;
    }

    public LocalDateTime getTimeSuggestion() {
        return timeSuggestion;
    }

    public void setTimeSuggestion(LocalDateTime timeSuggestion) {
        this.timeSuggestion = timeSuggestion;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ApplyStatus getApplyStatus() {
        return applyStatus;
    }

    public void setApplyStatus(ApplyStatus applyStatus) {
        this.applyStatus = applyStatus;
    }

}
