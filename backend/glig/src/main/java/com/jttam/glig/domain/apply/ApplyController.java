package com.jttam.glig.domain.apply;

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
@RequestMapping("api/apply")
@Tag(name = "Apply", description = "Operations related to applying for tasks.")
public class ApplyController {

    private final ApplyControllerService service;
    private final GlobalServiceMethods methods;

    public ApplyController(ApplyControllerService service, GlobalServiceMethods methods) {
        this.service = service;
        this.methods = methods;
    }

    @Operation(summary = "Get a single apply for a task", description = "Fetches a single apply DTO for a given task ID, for the authenticated user.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Apply data fetched successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Apply not found")
    })
    @GetMapping("/task/{taskId}")
    public ApplyDto getSingleApplyDto(@PathVariable Long taskId, @AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getSubject();
        return service.tryGetSingleApplyDtoById(taskId, username);
    }

    @Operation(summary = "Get all applies for the authenticated user", description = "Fetches all applies made by the currently authenticated user.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Applies fetched successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/user-applies")
    public Page<ApplyListDTO> getAllUserAppliesAndReturnPage(
            @PageableDefault(size = 10, page = 0, sort = "createdAt", direction = Sort.Direction.ASC) Pageable pageable,
            ApplyDataGridFilters filters, @AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getSubject();
        return service.tryGetAllUserApplies(pageable, filters, username);
    }

    @Operation(summary = "Create a new apply for a task", description = "Creates a new apply for a specific task by the authenticated user.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Apply created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid apply data provided or user has already applied"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Task not found")
    })
    @PostMapping("/{taskId}/create-apply")
    public ResponseEntity<?> createApplyForTask(@PathVariable Long taskId, @Valid @RequestBody ApplyDto applyDto,
            BindingResult bindingResult, @AuthenticationPrincipal Jwt jwt) {

        methods.hasBindingResultErrors(bindingResult);
        String username = jwt.getSubject();
        return service.tryCreateNewApplyForTask(taskId, applyDto, username);
    }

    @Operation(summary = "Edit an existing apply", description = "Allows an authenticated user to edit their own apply for a task.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Apply updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid apply data provided"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden, user is not the owner of the apply"),
            @ApiResponse(responseCode = "404", description = "Apply to edit not found")
    })
    @PutMapping("/{taskId}/edit")
    public ResponseEntity<ApplyDto> editApply(@PathVariable Long taskId, @Valid @RequestBody ApplyDto applyDto,
            BindingResult bindingResult, @AuthenticationPrincipal Jwt jwt) {

        methods.hasBindingResultErrors(bindingResult);
        String username = jwt.getSubject();
        return service.tryEditApply(taskId, applyDto, username);
    }

    @Operation(summary = "Delete an apply", description = "Allows an authenticated user to delete their own apply for a task.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Apply deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden, user is not the owner of the apply"),
            @ApiResponse(responseCode = "404", description = "Apply to delete not found")
    })
    @DeleteMapping("/{taskId}/delete")
    public ResponseEntity<Message> deleteApply(@PathVariable Long taskId, @AuthenticationPrincipal Jwt jwt) {

        String username = jwt.getSubject();
        return service.tryDeleteApply(taskId, username);
    }
}
