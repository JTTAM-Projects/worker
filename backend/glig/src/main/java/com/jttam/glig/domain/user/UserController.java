package com.jttam.glig.domain.user;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import com.jttam.glig.service.GlobalServiceMethods;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user")
@Tag(name = "User", description = "Operations related to Users. ")
public class UserController {

    private final UserControllerService service;
    private final GlobalServiceMethods methods;

    public UserController(UserControllerService service, GlobalServiceMethods methods) {
        this.service = service;
        this.methods = methods;
    }

    @Operation(summary = "Get user by username", description = "Fetches public information of a single user by their username.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User data fetched successfully"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/{username}")
    public UserDto getSingleUser(@PathVariable String username) {

        return service.tryGetSingleUserDtoByUserName(username);
    }

    @Operation(summary = "Create a new user profile", description = "Creates a new user profile based on the authenticated user's JWT information. The user must not have a profile already.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "User created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid user data provided or user already exists"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @PostMapping("/me")
    public ResponseEntity<?> createUser(@Valid @RequestBody UserDto userDto, BindingResult bindingResult,
            @AuthenticationPrincipal Jwt jwt) {

        methods.hasBindingResultErrors(bindingResult);
        String username = jwt.getSubject();
        return service.tryCreateNewUser(userDto, username);
    }

    @Operation(summary = "Edit authenticated user's profile", description = "Allows an authenticated user to edit their own profile information.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User profile updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid user data provided"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "User profile to edit not found")
    })
    @PutMapping("/me")
    public ResponseEntity<UserDto> editUser(@Valid @RequestBody UserDto userDto, BindingResult bindingResult,
            @AuthenticationPrincipal Jwt jwt) {

        methods.hasBindingResultErrors(bindingResult);
        String username = jwt.getSubject();
        return service.tryEditUser(userDto, username);
    }

    @Operation(summary = "Delete authenticated user's profile", description = "Allows an authenticated user to delete their own profile.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User profile deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "User profile to delete not found")
    })
    @DeleteMapping("/me")
    public ResponseEntity<UserDto> deleteUser(
            @AuthenticationPrincipal Jwt jwt) {

        String username = jwt.getSubject();
        return service.tryDeleteUser(username);
    }

}
