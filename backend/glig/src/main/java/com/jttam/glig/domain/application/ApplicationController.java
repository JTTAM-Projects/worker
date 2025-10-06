package com.jttam.glig.domain.application;

import org.springframework.data.web.PageableDefault;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
@RequestMapping("api")
@Tag(name = "Application", description = "Operations related to applying for tasks.")
public class ApplicationController {

    private final ApplicationControllerService service;
    private final GlobalServiceMethods methods;

    public ApplicationController(ApplicationControllerService service, GlobalServiceMethods methods) {
        this.service = service;
        this.methods = methods;
    }

    @Operation(summary = "Get a single application for a task", description = "Fetches a single application DTO for a given task ID, for the authenticated user.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Application data fetched successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Application not found")
    })
    @GetMapping("/task/{taskId}/application")
    public ApplicationDto getSingleApplicationDto(@PathVariable Long taskId, @AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getSubject();
        return service.tryGetSingleApplyDtoById(taskId, username);
    }

    @Operation(summary = "Get all applications for the authenticated user", description = "Fetches all applications made by the currently authenticated user.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Applications fetched successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/user-applications")
    public Page<ApplicationListDTO> getAllUserApplicationsAndReturnPage(
            @PageableDefault(size = 10, page = 0, sort = "createdAt", direction = Sort.Direction.ASC) Pageable pageable,
            ApplicationDataGridFilters filters, @AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getSubject();
        return service.tryGetAllUserApplies(pageable, filters, username);
    }

    @Operation(summary = "Create a new application for a task", description = "Creates a new application for a specific task by the authenticated user.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Application created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid application data provided or user has already applied"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Task not found")
    })
    @PostMapping("/task/{taskId}/application")
    public ResponseEntity<?> createApplicationForTask(@PathVariable Long taskId,
            @Valid @RequestBody ApplicationDto applyDto,
            BindingResult bindingResult, @AuthenticationPrincipal Jwt jwt) {

        methods.hasBindingResultErrors(bindingResult);
        String username = jwt.getSubject();
        return service.tryCreateNewApplyForTask(taskId, applyDto, username);
    }

    @Operation(summary = "Edit an existing application", description = "Allows an authenticated user to edit their own application for a task.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Application updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid application data provided"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden, user is not the owner of the application"),
            @ApiResponse(responseCode = "404", description = "Application to edit not found")
    })
    @PutMapping("/task/{taskId}/application")
    public ResponseEntity<ApplicationDto> editApplication(@PathVariable Long taskId,
            @Valid @RequestBody ApplicationDto applyDto,
            BindingResult bindingResult, @AuthenticationPrincipal Jwt jwt) {

        methods.hasBindingResultErrors(bindingResult);
        String username = jwt.getSubject();
        return service.tryEditApply(taskId, applyDto, username);
    }

    @Operation(summary = "Delete an application", description = "Allows an authenticated user to delete their own application for a task.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Application deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden, user is not the owner of the application"),
            @ApiResponse(responseCode = "404", description = "Application to delete not found")
    })
    @DeleteMapping("/task/{taskId}/application")
    public ResponseEntity<Message> deleteApplication(@PathVariable Long taskId, @AuthenticationPrincipal Jwt jwt) {

        String username = jwt.getSubject();
        return service.tryDeleteApply(taskId, username);
    }
}
