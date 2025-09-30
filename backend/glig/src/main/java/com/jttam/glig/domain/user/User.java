package com.jttam.glig.domain.user;

import java.util.HashSet;
import java.util.Set;
import com.jttam.glig.domain.apply.Apply;
import com.jttam.glig.domain.task.Task;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {

    @Id
    @Column(name = "user_name")
    String userName;

    @Column(name = "business_id")
    String businessId = "";

    @Column(name = "address")
    String address = "";

    @Column(name = "phone_number")
    String phoneNumber = "";

    @Column(name = "mail")
    String mail = "";

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user", orphanRemoval = false)
    private Set<Apply> applies = new HashSet<>();

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user", orphanRemoval = false)
    private Set<Task> tasks = new HashSet<>();

    public User() {
    }

    public User(String businessId, String address, String phoneNumber, String mail) {
        this.businessId = businessId;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.mail = mail;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getBusinessId() {
        return businessId;
    }

    public void setBusinessId(String businessId) {
        this.businessId = businessId;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getMail() {
        return mail;
    }

    public void setMail(String mail) {
        this.mail = mail;
    }

    public Set<Apply> getApplies() {
        return applies;
    }

    public void setApplies(Set<Apply> applies) {
        this.applies = applies;
    }

    public Set<Task> getTasks() {
        return tasks;
    }

    public void setTasks(Set<Task> tasks) {
        this.tasks = tasks;
    }

}
