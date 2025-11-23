package com.jttam.glig.domain.task;

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
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

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
    @Parameters({
            @Parameter(name = "taskId", description = "The ID of the task to be retrieved.", required = true, example = "1")
    })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Task data fetched successfully"),
            @ApiResponse(responseCode = "404", description = "Task not found")
    })
    @GetMapping("/{taskId}")
    public TaskResponse getSingleTaskDto(@PathVariable Long taskId) {
        return service.tryGetSingleTaskDtoById(taskId);
    }

    @Operation(summary = "Get all tasks with advanced filtering", description = "Retrieves a paginated list of all tasks. "
            +
            "The results can be filtered by status, price range, categories, and a free-text search. " +
            "Standard pagination and sorting parameters are also supported.")
    @Parameters({
            @Parameter(name = "page", description = "Page number of the result set (0-indexed).", example = "0"),
            @Parameter(name = "size", description = "Number of items per page.", example = "10"),
            @Parameter(name = "sort", description = "Sorting criteria in the format: property,(asc|desc). " +
                    "Default is ascending. Multiple sort criteria are supported.", example = "price,desc"),
            @Parameter(name = "taskStatus", description = "Filter tasks by their status.", example = "ACTIVE"),
            @Parameter(name = "searchText", description = "Free-text search across the task's title and description. "
                    +
                    "The search is case-insensitive and matches partial text.", example = "urgent"),
            @Parameter(name = "categories", description = "Filter by one or more category titles. " +
                    "Provide multiple times for OR logic (e.g., &categories=Cleaning&categories=IT).", example = "Garden"),
            @Parameter(name = "minPrice", description = "Filter for tasks with a price greater than or equal to this value.", example = "50"),
            @Parameter(name = "maxPrice", description = "Filter for tasks with a price less than or equal to this value.", example = "200")
    })
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

    @Operation(summary = "Get all tasks for the authenticated user with advanced filtering", description = "Retrieves a paginated list of tasks owned by the currently authenticated user. "
            +
            "The results can be filtered by status, price range, categories, and a free-text search. " +
            "Standard pagination and sorting parameters are also supported.")
    @Parameters({
            @Parameter(name = "page", description = "Page number of the result set (0-indexed).", example = "0"),
            @Parameter(name = "size", description = "Number of items per page.", example = "10"),
            @Parameter(name = "sort", description = "Sorting criteria in the format: property,(asc|desc). " +
                    "Default is ascending. Multiple sort criteria are supported.", example = "price,desc"),
            @Parameter(name = "taskStatus", description = "Filter tasks by their status.", example = "ACTIVE"),
            @Parameter(name = "searchText", description = "Free-text search across the task's title and description. "
                    +
                    "The search is case-insensitive and matches partial text.", example = "urgent"),
            @Parameter(name = "categories", description = "Filter by one or more category titles. " +
                    "Provide multiple times for OR logic (e.g., &categories=Cleaning&categories=IT).", example = "Garden"),
            @Parameter(name = "minPrice", description = "Filter for tasks with a price greater than or equal to this value.", example = "50"),
            @Parameter(name = "maxPrice", description = "Filter for tasks with a price less than or equal to this value.", example = "200")
    })
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

    @Operation(summary = "Get all tasks for the authenticated worker with advanced filtering", description = "Fetches a paginated list of tasks for which the authenticated user has an accepted application. "
            +
            "The results can be filtered by status, price range, categories, and a free-text search. " +
            "Standard pagination and sorting parameters are also supported.")
    @Parameters({
            @Parameter(name = "page", description = "Page number of the result set (0-indexed).", example = "0"),
            @Parameter(name = "size", description = "Number of items per page.", example = "10"),
            @Parameter(name = "sort", description = "Sorting criteria in the format: property,(asc|desc). " +
                    "Default is ascending. Multiple sort criteria are supported.", example = "price,desc"),
            @Parameter(name = "taskStatus", description = "Filter tasks by their status.", example = "ACTIVE"),
            @Parameter(name = "searchText", description = "Free-text search across the task's title and description. "
                    +
                    "The search is case-insensitive and matches partial text.", example = "urgent"),
            @Parameter(name = "categories", description = "Filter by one or more category titles. " +
                    "Provide multiple times for OR logic (e.g., &categories=Cleaning&categories=IT).", example = "Garden"),
            @Parameter(name = "minPrice", description = "Filter for tasks with a price greater than or equal to this value.", example = "50"),
            @Parameter(name = "maxPrice", description = "Filter for tasks with a price less than or equal to this value.", example = "200")
    })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Tasks fetched successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/worker-tasks")
    public Page<TaskListDTO> getWorkerTasks(
            @PageableDefault(size = 10, page = 0, direction = Sort.Direction.ASC) Pageable pageable,
            TaskDataGridFilters filters, @AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getSubject();
        return service.tryGetWorkerTasks(pageable, filters, username);
    }

    @Operation(summary = "Create a new task", description = "Creates a new task for the authenticated user. The request body should contain the task details.")
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

    @Operation(summary = "Edit an existing task", description = "Allows an authenticated user to edit their own task. The request body should contain the updated task details.")
    @Parameters({
            @Parameter(name = "taskId", description = "The ID of the task to be edited.", required = true, example = "1")
    })
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

    @PatchMapping("/{taskId}/status")
    @Operation(summary = "Update task status", description = "Updates the status of a task. This can be done by the task owner or the assigned worker, depending on the status transition.")
    @Parameters({
            @Parameter(name = "taskId", description = "The ID of the task whose status is to be updated.", required = true, example = "1")
    })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Task status updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid status payload or illegal status transition"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden, user is not authorized to perform this status change"),
            @ApiResponse(responseCode = "404", description = "Task not found")
    })
    public ResponseEntity<TaskResponse> updateTaskStatus(@PathVariable @NotNull Long taskId,
            @Valid @RequestBody TaskStatusUpdateRequest request,
            BindingResult bindingResult,
            @AuthenticationPrincipal Jwt jwt) {

        methods.hasBindingResultErrors(bindingResult);
        String username = jwt.getSubject();
        return service.tryUpdateTaskStatus(taskId, request.taskStatus(), username);
    }

    @Operation(summary = "Delete a task", description = "Allows an authenticated user to delete their own task. This action is irreversible.")
    @Parameters({
            @Parameter(name = "taskId", description = "The ID of the task to be deleted.", required = true, example = "1")
    })
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
