package com.jttam.glig.domain.employerprofile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jttam.glig.domain.common.ProfileStatus;
import com.jttam.glig.domain.employerprofile.dto.EmployerProfileRequest;
import com.jttam.glig.domain.employerprofile.dto.EmployerProfileResponse;
import com.jttam.glig.exception.custom.NotFoundException;
import com.jttam.glig.testdata.TestDataService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
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

    @MockBean
    private TestDataService testDataService;

    private EmployerProfileResponse employerProfileResponse;
    private EmployerProfileRequest createRequest;
    private Jwt jwt;

    private static final String USER_ID = "auth0|12345";

    @BeforeEach
    void setUp() {
        employerProfileResponse = new EmployerProfileResponse(
            1L,                                   // employerProfileId
            USER_ID,                              // userId
            "Test",                               // firstName
            "User",                               // lastName
            EmployerType.COMPANY,                 // employerType
            "123 Test St",                        // streetAddress
            "12345",                              // postalCode
            "Testville",                          // city
            "Testland",                           // country
            "This is a test bio.",                // bio
            "Test Corp",                          // companyName
            "1234567-8",                          // businessId
            "https://testcorp.com",               // websiteLink
            "https://testcorp.com/profile.jpg",   // profileImageUrl
            false,                                // isVerified
            null,                                 // createdAt
            null,                                 // updatedAt
            ProfileStatus.ACTIVE                  // status
        );

        createRequest = new EmployerProfileRequest(
            null,                                 // userId
            "Test",                               // firstName
            "User",                               // lastName
            EmployerType.COMPANY,                 // employerType
            "123 Test St",                        // streetAddress
            "12345",                              // postalCode
            "Testville",                          // city
            "Testland",                           // country
            "This is a test bio.",                // bio
            "Test Corp",                          // companyName
            "1234567-8",                          // businessId
            "https://testcorp.com",               // websiteLink
            "https://testcorp.com/profile.jpg"    // profileImageUrl
        );

        jwt = Jwt.withTokenValue("token")
                .header("alg", "none")
                .claim("sub", USER_ID)
                .build();
    }

    @Test
    void getMyProfile_shouldReturnProfile_whenFound() throws Exception {
        given(employerProfileService.getEmployerProfile(USER_ID)).willReturn(employerProfileResponse);

        mockMvc.perform(get("/api/employer-profiles/me")
                .with(jwt().jwt(jwt)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.companyName").value("Test Corp"))
                .andExpect(jsonPath("$.streetAddress").value("123 Test St"));
    }

    @Test
    void getMyProfile_shouldReturnNotFound_whenNotFound() throws Exception {
        given(employerProfileService.getEmployerProfile(USER_ID))
                .willThrow(new NotFoundException("NOT_FOUND", "Profile not found"));

        mockMvc.perform(get("/api/employer-profiles/me")
                .with(jwt().jwt(jwt)))
                .andExpect(status().isNotFound());
    }

    @Test
    void createMyProfile_shouldReturnCreatedProfile() throws Exception {
        given(employerProfileService.createEmployerProfile(anyString(), any(EmployerProfileRequest.class)))
                .willReturn(employerProfileResponse);

        mockMvc.perform(post("/api/employer-profiles")
                .with(jwt().jwt(jwt))
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.companyName").value("Test Corp"))
                .andExpect(jsonPath("$.streetAddress").value("123 Test St"));
    }

    @Test
    void createMyProfile_shouldReturnBadRequest_whenRequestInvalid() throws Exception {
        EmployerProfileRequest invalidRequest = new EmployerProfileRequest(
            null, null, null, null, null, null, null, null, null, null, null, null, null
        ); // missing required fields

        mockMvc.perform(post("/api/employer-profiles")
                .with(jwt().jwt(jwt))
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateMyProfile_shouldReturnUpdatedProfile() throws Exception {
        given(employerProfileService.updateEmployerProfile(anyString(), any(EmployerProfileRequest.class)))
                .willReturn(employerProfileResponse);

        mockMvc.perform(put("/api/employer-profiles/me")
                .with(jwt().jwt(jwt))
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.companyName").value("Test Corp"))
                .andExpect(jsonPath("$.streetAddress").value("123 Test St"));
    }

    @Test
    void updateMyProfile_shouldReturnNotFound_whenNotFound() throws Exception {
        given(employerProfileService.updateEmployerProfile(anyString(), any(EmployerProfileRequest.class)))
                .willThrow(new NotFoundException("NOT_FOUND", "Profile not found"));

        mockMvc.perform(put("/api/employer-profiles/me")
                .with(jwt().jwt(jwt))
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteMyProfile_shouldReturnNoContent_whenSuccessful() throws Exception {
        doNothing().when(employerProfileService).deleteEmployerProfile(USER_ID);

        mockMvc.perform(delete("/api/employer-profiles/me")
                .with(jwt().jwt(jwt))
                .with(csrf()))
                .andExpect(status().isNoContent());

        verify(employerProfileService).deleteEmployerProfile(USER_ID);
    }

    @Test
    void deleteMyProfile_shouldReturnNotFound_whenProfileNotFound() throws Exception {
        doThrow(new NotFoundException("NOT_FOUND", "Profile not found")).when(employerProfileService)
                .deleteEmployerProfile(USER_ID);

        mockMvc.perform(delete("/api/employer-profiles/me")
                .with(jwt().jwt(jwt))
                .with(csrf()))
                .andExpect(status().isNotFound());
    }
}
