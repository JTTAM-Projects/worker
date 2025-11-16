package com.jttam.glig.domain.application;

import java.time.LocalDateTime;

import com.jttam.glig.domain.common.baseClass;
import com.jttam.glig.domain.task.Task;
import com.jttam.glig.domain.user.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "applies")
@IdClass(ApplicationId.class)
public class Application extends baseClass {

    @Id
    @ManyToOne
    @JoinColumn(name = "user_name")
    private User user;

    @Id
    @ManyToOne
    @JoinColumn(name = "task_id")
    private Task task;

    @Column(name = "price_suggestion")
    int priceSuggestion = 0;

    @Column(name = "time_suggestion")
    LocalDateTime timeSuggestion = LocalDateTime.now();

    @Column(name = "description")
    String description = "";

    @Enumerated(EnumType.STRING)
    @Column(name = "apply_status")
    ApplicationStatus applicationStatus = ApplicationStatus.PENDING;

    public Application() {
    }

    public Application(User user, Task task, int priceSuggestion, LocalDateTime timeSuggestion, String description,
            ApplicationStatus applyStatus) {
        this.user = user;
        this.task = task;
        this.priceSuggestion = priceSuggestion;
        this.timeSuggestion = timeSuggestion;
        this.description = description;
        this.applicationStatus = applyStatus;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
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

    public ApplicationStatus getApplicationStatus() {
        return applicationStatus;
    }

    public void setApplicationStatus(ApplicationStatus applyStatus) {
        this.applicationStatus = applyStatus;
    }

    @Override
    public String toString() {
        return "Apply [username=" + user.getUserName() + ", taskId=" + task.getId() + ", priceSuggestion="
                + priceSuggestion + ", timeSuggestion="
                + timeSuggestion + ", description=" + description + ", applyStatus=" + applicationStatus + "]";
    }

}
