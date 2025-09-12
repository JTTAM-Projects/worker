package com.jttam.glig.domain.task;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.jttam.glig.service.Message;

import jakarta.validation.Valid;

@RestController
@RequestMapping("task/")
public class TaskController {

    private final TaskControllerService service;

    public TaskController(TaskControllerService service) {
        this.service = service;
    }

    @GetMapping("{taskId}")
    public TaskDto getSingleTaskDto(@PathVariable Long taskId) {
        return service.tryGetSingleTaskDtoById(taskId);
    }

    @GetMapping("user-tasks")
    public List<TaskDto> getAllUserTasks() {
        return service.tryGetAllUserTasks();
    }

    @PostMapping("create-task")
    public ResponseEntity<Message> createTask(@Valid @RequestBody TaskDto taskDto,
            BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    bindingResult.getAllErrors().get(0).getDefaultMessage());
        }

        return service.tryCreateNewTask(taskDto);
    }

    @PutMapping("{taskId}/edit")
    public ResponseEntity<Message> editTask(@PathVariable Long taskId, @Valid @RequestBody TaskDto taskDto,
            BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    bindingResult.getAllErrors().get(0).getDefaultMessage());
        }

        return service.tryEditTask(taskId, taskDto);
    }

}
