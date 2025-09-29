package com.jttam.glig.domain.task;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import com.jttam.glig.service.GlobalServiceMethods;
import com.jttam.glig.service.Message;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/task")
@Tag(name = "Task", description = "Operations related to Tasks.")
public class TaskController {

    private final TaskControllerService service;
    private final GlobalServiceMethods methods;

    public TaskController(TaskControllerService service, GlobalServiceMethods methods) {
        this.service = service;
        this.methods = methods;
    }

    @Operation(summary = "Get a single task by its id", description = "Fetches a single task by its id.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Task data fetched successfully"),
            @ApiResponse(responseCode = "404", description = "Task not found")
    })
    @GetMapping("/{taskId}")
    public TaskDto getSingleTaskDto(@PathVariable Long taskId) {
        return service.tryGetSingleTaskDtoById(taskId);
    }

    @Operation(summary = "Get all tasks for the authenticated user", description = "Fetches all tasks for the currently authenticated user.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Tasks fetched successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/user-tasks")
    public List<TaskDto> getAllUserTasks(@AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getSubject();
        return service.tryGetAllUserTasks(username);
    }

    @Operation(summary = "Create a new task", description = "Creates a new task for the authenticated user.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Task created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid task data provided"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @PostMapping("/create-task")
    public ResponseEntity<TaskDto> createTask(@Valid @RequestBody TaskDto taskDto, BindingResult bindingResult,
            @AuthenticationPrincipal Jwt jwt) {

        methods.hasBindingResultErrors(bindingResult);
        String username = jwt.getSubject();
        return service.tryCreateNewTask(taskDto, username);
    }

    @Operation(summary = "Edit an existing task", description = "Allows an authenticated user to edit their own task.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Task updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid task data provided"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden, user is not the owner of the task"),
            @ApiResponse(responseCode = "404", description = "Task to edit not found")
    })
    @PutMapping("/{taskId}/edit")
    public ResponseEntity<TaskDto> editTask(@PathVariable Long taskId, @Valid @RequestBody TaskDto taskDto,
            BindingResult bindingResult,
            @AuthenticationPrincipal Jwt jwt) {

        methods.hasBindingResultErrors(bindingResult);
        String username = jwt.getSubject();
        return service.tryEditTask(taskId, taskDto, username);
    }

    @Operation(summary = "Delete a task", description = "Allows an authenticated user to delete their own task.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Task deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden, user is not the owner of the task"),
            @ApiResponse(responseCode = "404", description = "Task to delete not found")
    })
    @DeleteMapping("/{taskId}/delete")
    public ResponseEntity<Message> deleteTask(@PathVariable Long taskId,
            @AuthenticationPrincipal Jwt jwt) {

        String username = jwt.getSubject();
        return service.tryDeleteTask(taskId, username);

    }

}
