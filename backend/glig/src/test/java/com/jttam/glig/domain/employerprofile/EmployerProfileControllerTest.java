package com.jttam.glig.domain.employerprofile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jttam.glig.domain.employerprofile.dto.CreateEmployerProfileRequest;
import com.jttam.glig.domain.employerprofile.dto.EmployerProfileResponse;
import com.jttam.glig.exception.GlobalExceptionHandler;
import com.jttam.glig.exception.custom.NotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/*
 * NOTE: These tests are currently failing with 500 Internal Server Errors.
 * The likely cause is a misconfiguration in the MockMvc standalone setup.
 * Specifically, the setup is missing a registered HttpMessageConverter for JSON,
 * which is necessary for serializing and deserializing request/response bodies.
 * 
 * should be looked up again once the project is more complete.
 */
@ExtendWith(MockitoExtension.class)
class EmployerProfileControllerTest {

    private MockMvc mockMvc;

    @Mock
    private EmployerProfileService employerProfileService;

    @InjectMocks
    private EmployerProfileController employerProfileController;

    private ObjectMapper objectMapper;
    private EmployerProfileResponse employerProfileResponse;
    private CreateEmployerProfileRequest createRequest;
    private Jwt jwt;

    private static final String USER_ID = "auth0|12345";

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .standaloneSetup(employerProfileController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        objectMapper = new ObjectMapper();

        employerProfileResponse = new EmployerProfileResponse();
        employerProfileResponse.setEmployerProfileId(1L);
        employerProfileResponse.setUserId(USER_ID);
        employerProfileResponse.setCompanyName("Test Corp");
        employerProfileResponse.setStatus(ProfileStatus.ACTIVE);

        createRequest = new CreateEmployerProfileRequest();
        createRequest.setCompanyName("Test Corp");
        createRequest.setEmployerType(EmployerType.COMPANY);

        jwt = Jwt.withTokenValue("token")
                .header("alg", "none")
                .claim("sub", USER_ID)
                .build();
    }

    @Test
    void getMyProfile_shouldReturnProfile_whenFound() throws Exception {
        given(employerProfileService.getEmployerProfile(USER_ID)).willReturn(employerProfileResponse);

        mockMvc.perform(get("/api/employer-profiles/me")
                        .with(authentication(new JwtAuthenticationToken(jwt))))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.companyName").value("Test Corp"));
    }

    @Test
    void getMyProfile_shouldReturnNotFound_whenNotFound() throws Exception {
        given(employerProfileService.getEmployerProfile(USER_ID)).willThrow(new NotFoundException("NOT_FOUND", "Profile not found"));

        mockMvc.perform(get("/api/employer-profiles/me")
                        .with(authentication(new JwtAuthenticationToken(jwt))))
                .andExpect(status().isNotFound());
    }

    @Test
    void createMyProfile_shouldReturnCreatedProfile() throws Exception {
        given(employerProfileService.createEmployerProfile(any(CreateEmployerProfileRequest.class), anyString())).willReturn(employerProfileResponse);

        mockMvc.perform(post("/api/employer-profiles")
                        .with(authentication(new JwtAuthenticationToken(jwt)))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.companyName").value("Test Corp"));
    }

    @Test
    void createMyProfile_shouldReturnBadRequest_whenRequestInvalid() throws Exception {
        CreateEmployerProfileRequest invalidRequest = new CreateEmployerProfileRequest(); // missing required fields

        mockMvc.perform(post("/api/employer-profiles")
                        .with(authentication(new JwtAuthenticationToken(jwt)))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateMyProfile_shouldReturnUpdatedProfile() throws Exception {
        given(employerProfileService.updateEmployerProfile(any(CreateEmployerProfileRequest.class), anyString())).willReturn(employerProfileResponse);

        mockMvc.perform(put("/api/employer-profiles/me")
                        .with(authentication(new JwtAuthenticationToken(jwt)))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.companyName").value("Test Corp"));
    }

    @Test
    void updateMyProfile_shouldReturnNotFound_whenNotFound() throws Exception {
        given(employerProfileService.updateEmployerProfile(any(CreateEmployerProfileRequest.class), anyString())).willThrow(new NotFoundException("NOT_FOUND", "Profile not found"));

        mockMvc.perform(put("/api/employer-profiles/me")
                        .with(authentication(new JwtAuthenticationToken(jwt)))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteMyProfile_shouldReturnNoContent_whenSuccessful() throws Exception {
        doNothing().when(employerProfileService).deleteEmployerProfile(USER_ID);

        mockMvc.perform(delete("/api/employer-profiles/me")
                        .with(authentication(new JwtAuthenticationToken(jwt)))
                        .with(csrf()))
                .andExpect(status().isNoContent());

        verify(employerProfileService).deleteEmployerProfile(USER_ID);
    }

    @Test
    void deleteMyProfile_shouldReturnNotFound_whenProfileNotFound() throws Exception {
        doThrow(new NotFoundException("NOT_FOUND", "Profile not found")).when(employerProfileService).deleteEmployerProfile(USER_ID);

        mockMvc.perform(delete("/api/employer-profiles/me")
                        .with(authentication(new JwtAuthenticationToken(jwt)))
                        .with(csrf()))
                .andExpect(status().isNotFound());
    }
}
