package com.jttam.glig.domain.employerprofile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jttam.glig.domain.employerprofile.dto.EmployerProfileRequest;
import com.jttam.glig.domain.employerprofile.dto.EmployerProfileResponse;
import com.jttam.glig.exception.custom.NotFoundException;
import com.jttam.glig.domain.common.ProfileStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.test.web.servlet.MockMvc;

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

@WebMvcTest(EmployerProfileController.class)
class EmployerProfileControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private EmployerProfileService employerProfileService;

    private EmployerProfileResponse employerProfileResponse;
    private EmployerProfileRequest createRequest;
    private Jwt jwt;

    private static final String USER_ID = "auth0|12345";

    @BeforeEach
    void setUp() {
        employerProfileResponse = new EmployerProfileResponse();
        employerProfileResponse.setEmployerProfileId(1L);
        employerProfileResponse.setUserId(USER_ID);
        employerProfileResponse.setCompanyName("Test Corp");
        employerProfileResponse.setStreetAddress("123 Test St");
        employerProfileResponse.setCity("Testville");
        employerProfileResponse.setCountry("Testland");
        employerProfileResponse.setStatus(ProfileStatus.ACTIVE);

        createRequest = new EmployerProfileRequest();
        createRequest.setCompanyName("Test Corp");
        createRequest.setEmployerType(EmployerType.COMPANY);
        createRequest.setStreetAddress("123 Test St");
        createRequest.setCity("Testville");
        createRequest.setCountry("Testland");

        jwt = Jwt.withTokenValue("token")
        .header("alg", "none")
        .claim("sub", USER_ID)
        .claim("scope", "profile:manage") 
        .build();
    }

    @Test
    void getMyProfile_shouldReturnProfile_whenFound() throws Exception {
        given(employerProfileService.getEmployerProfile(USER_ID)).willReturn(employerProfileResponse);

        mockMvc.perform(get("/api/v1/employer-profiles/me")
                        .with(authentication(new JwtAuthenticationToken(jwt))))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.companyName").value("Test Corp"))
                .andExpect(jsonPath("$.streetAddress").value("123 Test St"));
    }

    @Test
    void getMyProfile_shouldReturnNotFound_whenNotFound() throws Exception {
        given(employerProfileService.getEmployerProfile(USER_ID)).willThrow(new NotFoundException("NOT_FOUND", "Profile not found"));

        mockMvc.perform(get("/api/v1/employer-profiles/me")
                        .with(authentication(new JwtAuthenticationToken(jwt))))
                .andExpect(status().isNotFound());
    }

    @Test
    void createMyProfile_shouldReturnCreatedProfile() throws Exception {
        given(employerProfileService.createEmployerProfile(anyString(), any(EmployerProfileRequest.class))).willReturn(employerProfileResponse);

        mockMvc.perform(post("/api/v1/employer-profiles")
                        .with(authentication(new JwtAuthenticationToken(jwt)))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.companyName").value("Test Corp"))
                .andExpect(jsonPath("$.streetAddress").value("123 Test St"));
    }

    @Test
    void createMyProfile_shouldReturnBadRequest_whenRequestInvalid() throws Exception {
        EmployerProfileRequest invalidRequest = new EmployerProfileRequest(); // missing required fields

        mockMvc.perform(post("/api/v1/employer-profiles")
                        .with(authentication(new JwtAuthenticationToken(jwt)))
                        
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateMyProfile_shouldReturnUpdatedProfile() throws Exception {
        given(employerProfileService.updateEmployerProfile(anyString(), any(EmployerProfileRequest.class))).willReturn(employerProfileResponse);

        mockMvc.perform(put("/api/v1/employer-profiles/me")
                        .with(authentication(new JwtAuthenticationToken(jwt)))
                        
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.companyName").value("Test Corp"))
                .andExpect(jsonPath("$.streetAddress").value("123 Test St"));
    }

    @Test
    void updateMyProfile_shouldReturnNotFound_whenNotFound() throws Exception {
        given(employerProfileService.updateEmployerProfile(anyString(), any(EmployerProfileRequest.class))).willThrow(new NotFoundException("NOT_FOUND", "Profile not found"));

        mockMvc.perform(put("/api/v1/employer-profiles/me")
                        .with(authentication(new JwtAuthenticationToken(jwt)))
                        
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteMyProfile_shouldReturnNoContent_whenSuccessful() throws Exception {
        doNothing().when(employerProfileService).deleteEmployerProfile(USER_ID);

        mockMvc.perform(delete("/api/v1/employer-profiles/me")
                        .with(authentication(new JwtAuthenticationToken(jwt)))
                        )
                .andExpect(status().isNoContent());

        verify(employerProfileService).deleteEmployerProfile(USER_ID);
    }

    @Test
    void deleteMyProfile_shouldReturnNotFound_whenProfileNotFound() throws Exception {
        doThrow(new NotFoundException("NOT_FOUND", "Profile not found")).when(employerProfileService).deleteEmployerProfile(USER_ID);

        mockMvc.perform(delete("/api/v1/employer-profiles/me")
                        .with(authentication(new JwtAuthenticationToken(jwt)))
                        )
                .andExpect(status().isNotFound());
    }
}
