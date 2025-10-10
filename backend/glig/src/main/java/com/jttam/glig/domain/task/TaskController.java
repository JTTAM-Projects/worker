package com.jttam.glig.domain.task;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import com.jttam.glig.domain.task.dto.TaskResponse;
import com.jttam.glig.domain.task.dto.TaskListDTO;
import com.jttam.glig.domain.task.dto.TaskRequest;
import com.jttam.glig.service.GlobalServiceMethods;
import com.jttam.glig.service.Message;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;

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
    public TaskResponse getSingleTaskDto(@PathVariable Long taskId) {
        return service.tryGetSingleTaskDtoById(taskId);
    }

    @Operation(summary = "Get all tasks", description = "Fetches all tasks depending on given filters and sorting parameters via query.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "All tasks fetched succesfully")
    })
    @GetMapping("/all-tasks")
    public Page<TaskListDTO> getAllTasks(
            @PageableDefault(size = 10, page = 0, direction = Sort.Direction.ASC) Pageable pageable,
            TaskDataGridFilters filters) {

        String username = null;

        return service.tryGetAllTaskByGivenFiltersAndSortsAndUserName(pageable, filters, username);
    }

    @Operation(summary = "Get all tasks for the authenticated user", description = "Fetches all tasks depending on given filters and sorting parameters via query for the currently authenticated user.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Tasks fetched successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/user-tasks")
    public Page<TaskListDTO> getAllUserTasks(
            @PageableDefault(size = 10, page = 0, direction = Sort.Direction.ASC) Pageable pageable,
            TaskDataGridFilters filters, @AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getSubject();
        return service.tryGetAllTaskByGivenFiltersAndSortsAndUserName(pageable, filters, username);
    }

    @Operation(summary = "Create a new task", description = "Creates a new task for the authenticated user.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Task created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid task data provided"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody TaskRequest taskRequest,
            BindingResult bindingResult,
            @AuthenticationPrincipal Jwt jwt) {

        methods.hasBindingResultErrors(bindingResult);
        String username = jwt.getSubject();
        return service.tryCreateNewTask(taskRequest, username);
    }

    @Operation(summary = "Edit an existing task", description = "Allows an authenticated user to edit their own task.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Task updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid task data provided"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden, user is not the owner of the task"),
            @ApiResponse(responseCode = "404", description = "Task to edit not found")
    })
    @PutMapping("/{taskId}")
    public ResponseEntity<TaskResponse> editTask(@PathVariable Long taskId, @Valid @RequestBody TaskRequest taskRequest,
            BindingResult bindingResult,
            @AuthenticationPrincipal Jwt jwt) {

        methods.hasBindingResultErrors(bindingResult);
        String username = jwt.getSubject();
        return service.tryEditTask(taskId, taskRequest, username);
    }

    @Operation(summary = "Delete a task", description = "Allows an authenticated user to delete their own task.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Task deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden, user is not the owner of the task"),
            @ApiResponse(responseCode = "404", description = "Task to delete not found")
    })
    @DeleteMapping("/{taskId}")
    public ResponseEntity<Message> deleteTask(@PathVariable Long taskId,
            @AuthenticationPrincipal Jwt jwt) {

        String username = jwt.getSubject();
        return service.tryDeleteTask(taskId, username);

    }

}
