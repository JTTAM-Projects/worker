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

import com.jttam.glig.domain.application.dto.ApplicationResponse;
import com.jttam.glig.domain.application.dto.MyApplicationDTO;
import com.jttam.glig.domain.application.dto.TaskApplicantDto;
import com.jttam.glig.domain.application.dto.UpdateApplicationStatusRequest;
import com.jttam.glig.domain.application.dto.ApplicationRequest;
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

    @Operation(summary = "Get a single application for a task (own)", description = "Fetches a single application DTO for a given task ID, using username in given jwt.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Application data fetched successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Application not found")
    })
    @GetMapping("/task/{taskId}/application")
    public ApplicationResponse getSingleApplication(@PathVariable Long taskId, @AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getSubject();
        return service.tryGetSingleApplicationResponseByUsernameAndTaskId(taskId, username);
    }

    @Operation(summary = "Get a single application for a task (not own)", description = "Fetches a single application DTO for a given task ID and username, example when fetching application from the list that isnt users own.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Application data fetched successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Application not found")
    })
    @GetMapping("/task/{taskId}/user/{username}/application")
    public ApplicationResponse getSingleApplication(@PathVariable Long taskId, @PathVariable String username) {
        return service.tryGetSingleApplicationResponseByUsernameAndTaskId(taskId, username);
    }

    @Operation(summary = "Get all applications of a task", description = "Fetches all applications that single task has.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Applications fetched successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/task/{taskId}/applications")
    public Page<TaskApplicantDto> getAllTaskApplications(
            @PageableDefault(size = 10, page = 0, sort = "createdAt", direction = Sort.Direction.ASC) Pageable pageable,
            ApplicationDataGridFilters filters,
            @PathVariable Long taskId) {

        return service.tryGetAllApplicationsByGivenTaskId(pageable, filters, taskId);
    }

    @Operation(summary = "Get all applications for the authenticated user", description = "Fetches all applications made by the currently authenticated user.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Applications fetched successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/user-applications")
    public Page<MyApplicationDTO> getAllUserApplicationsAndReturnPage(
            @PageableDefault(size = 10, page = 0, sort = "createdAt", direction = Sort.Direction.ASC) Pageable pageable,
            ApplicationDataGridFilters filters, @AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getSubject();
        return service.GetAllUserApplications(pageable, filters, username);
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
            @Valid @RequestBody ApplicationRequest applicationRequest,
            BindingResult bindingResult, @AuthenticationPrincipal Jwt jwt) {

        methods.hasBindingResultErrors(bindingResult);
        String username = jwt.getSubject();
        return service.tryCreateNewApplicationForTask(taskId, applicationRequest, username);
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
    public ResponseEntity<ApplicationResponse> editApplication(@PathVariable Long taskId,
            @Valid @RequestBody ApplicationRequest applicationRequest,
            BindingResult bindingResult, @AuthenticationPrincipal Jwt jwt) {

        methods.hasBindingResultErrors(bindingResult);
        String username = jwt.getSubject();
        return service.tryEditApplication(taskId, applicationRequest, username);
    }

    @Operation(summary = "Update an application's status", description = "Allows a task owner to accept or reject an application. The user must be the owner of the task to which the application belongs.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Application status updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid status provided"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden, user is not the owner of the task"),
            @ApiResponse(responseCode = "404", description = "Application not found")
    })
    @PatchMapping("/tasks/{taskId}/applications/{applicantUsername}/status")
    public ResponseEntity<ApplicationResponse> updateApplicationStatus(
            @PathVariable Long taskId,
            @PathVariable String applicantUsername,
            @Valid @RequestBody UpdateApplicationStatusRequest statusRequest,
            BindingResult bindingResult,
            @AuthenticationPrincipal Jwt jwt) {

        methods.hasBindingResultErrors(bindingResult);
        String taskOwnerUsername = jwt.getSubject();
        return service.tryUpdateApplicationStatus(taskId, applicantUsername, statusRequest, taskOwnerUsername);
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
        return service.tryDeleteApplication(taskId, username);
    }
}
