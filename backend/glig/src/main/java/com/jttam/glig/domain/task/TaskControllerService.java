package com.jttam.glig.domain.task;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.jttam.glig.service.Message;

@Service
public class TaskControllerService {
    private final TaskRepository repository;

    public TaskControllerService(TaskRepository repository) {
        this.repository = repository;
    }

    public TaskDto tryGetSingleTaskDtoById(Long taskId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'tryGetSingleTaskDtoById'");
    }

    public TaskListDTO tryGetAllUserTasks() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'tryGetAllUserTasks'");
    }

    public ResponseEntity<Message> tryCreateNewTask(Long taskId, TaskDto taskDto) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'tryCreateNewTask'");
    }

    public ResponseEntity<Message> tryEditTask(Long taskId, TaskDto taskDto) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'tryEditTask'");
    }

    // ...service-metodit...
}
