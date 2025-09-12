package com.jttam.glig.domain.task;

import java.time.LocalDateTime;

import com.jttam.glig.domain.user.UserDto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class TaskDto {

    private Long id;
    private UserDto user;
    @NotBlank
    private Category category;
    @NotBlank
    private String title;
    @NotNull
    private int price;
    @NotNull
    private LocalDateTime startDate;
    @NotNull
    private LocalDateTime endDate;
    @NotBlank
    private String location;
    private TaskStatus status;
    private String description;

    public TaskDto() {
    }

    public TaskDto(Long id, UserDto user, @NotBlank Category category, @NotBlank String title, @NotNull int price,
            @NotNull LocalDateTime startDate, @NotNull LocalDateTime endDate, @NotBlank String location,
            TaskStatus status, String description) {
        this.id = id;
        this.user = user;
        this.category = category;
        this.title = title;
        this.price = price;
        this.startDate = startDate;
        this.endDate = endDate;
        this.location = location;
        this.status = status;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public UserDto getUser() {
        return user;
    }

    public void setUser(UserDto user) {
        this.user = user;
    }
}
