package com.jttam.glig.domain.apply;

import java.io.Serializable;

public class ApplyId implements Serializable {

    private Long task;
    private String user;

    public ApplyId() {
    }

    public ApplyId(Long task, String user) {
        this.task = task;
        this.user = user;
    }

    public Long getTask() {
        return task;
    }

    public void setTask(Long taskId) {
        this.task = taskId;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String userName) {
        this.user = userName;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((task == null) ? 0 : task.hashCode());
        result = prime * result + ((user == null) ? 0 : user.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        ApplyId other = (ApplyId) obj;
        if (task == null) {
            if (other.task != null)
                return false;
        } else if (!task.equals(other.task))
            return false;
        if (user == null) {
            if (other.user != null)
                return false;
        } else if (!user.equals(other.user))
            return false;
        return true;
    }

}
