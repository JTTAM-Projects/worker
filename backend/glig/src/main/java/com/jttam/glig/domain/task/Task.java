package com.jttam.glig.domain.task;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.jttam.glig.domain.application.Application;
import com.jttam.glig.domain.category.Category;
import com.jttam.glig.domain.common.baseClass;
import com.jttam.glig.domain.location.Location;
import com.jttam.glig.domain.user.User;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "tasks")
public class Task extends baseClass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToMany
    @JoinTable(name = "task_category", joinColumns = @JoinColumn(name = "task_id"), inverseJoinColumns = @JoinColumn(name = "category_id"))
    private Set<Category> categories = new HashSet<>();

    @Column(name = "title")
    private String title = "";

    @Column(name = "price")
    private int price = 0;

    @Column(name = "start_date")
    private LocalDateTime startDate = LocalDateTime.now();

    @Column(name = "end_date")
    private LocalDateTime endDate = LocalDateTime.now();

    @ManyToMany
    @JoinTable(name = "task_location", joinColumns = @JoinColumn(name = "task_id"), inverseJoinColumns = @JoinColumn(name = "location_id"))
    private Set<Location> locations = new HashSet<>();

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private TaskStatus status;

    @Column(name = "description")
    private String description = "";

    @ManyToOne
    @JoinColumn(name = "user_name")
    private User user;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "task", orphanRemoval = false)
    private Set<Application> applies = new HashSet<>();

    public Task() {
    }

    public Task(String title, int price, LocalDateTime startDate, LocalDateTime endDate,
            TaskStatus status, String description, User user) {
        this.title = title;
        this.price = price;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.description = description;
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Set<Category> getCategories() {
        return categories;
    }

    public void setCategories(Set<Category> categories) {
        this.categories = categories;
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

    public Set<Location> getLocations() {
        return locations;
    }

    public void setLocations(Set<Location> locations) {
        this.locations = locations;
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Set<Application> getApplies() {
        return applies;
    }

    public void setApplies(Set<Application> applies) {
        this.applies = applies;
    }

    @Override
    public String toString() {
        return "Task [id=" + id + ", category count=" + categories.size() + ", title=" + title + ", price=" + price
                + ", startDate="
                + startDate + ", endDate=" + endDate + ", locations count=" + locations.size() + ", status="
                + status.getDisplayName()
                + ", description=" + description + ", user=" + user.getUserName() + "]";
    }

}
