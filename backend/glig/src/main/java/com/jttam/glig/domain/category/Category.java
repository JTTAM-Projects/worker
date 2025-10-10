package com.jttam.glig.domain.category;

import java.util.HashSet;
import java.util.Set;

import com.jttam.glig.domain.common.baseClass;
import com.jttam.glig.domain.task.Task;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "categories")
public class Category extends baseClass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Long categoryId;

    @Column(name = "title", nullable = false, unique = true)
    private String title;

    @ManyToMany(mappedBy = "categories")
    private Set<Task> tasks = new HashSet<>();

    public Category() {
    }

    public Category(String title) {
        this.title = title;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Set<Task> getTasks() {
        return tasks;
    }

    public void setTasks(Set<Task> tasks) {
        this.tasks = tasks;
    }

}
