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
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

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

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .standaloneSetup(employerProfileController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        objectMapper = new ObjectMapper();

        employerProfileResponse = new EmployerProfileResponse();
        employerProfileResponse.setEmployerProfileId(1L);
        employerProfileResponse.setUserId("auth0|12345");
        employerProfileResponse.setCompanyName("Test Corp");

        createRequest = new CreateEmployerProfileRequest();
        createRequest.setCompanyName("Test Corp");
        createRequest.setEmployerType(EmployerType.COMPANY);
        createRequest.setUserId("auth0|12345");
    }

    @Test
    @WithMockUser // This will now work
    void getEmployerProfile_shouldReturnProfile_whenFound() throws Exception {
        given(employerProfileService.getEmployerProfile()).willReturn(employerProfileResponse);

        mockMvc.perform(get("/api/employer-profile"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.companyName").value("Test Corp"));
    }

    @Test
    @WithMockUser // This will now work
    void getEmployerProfile_shouldReturnNotFound_whenNotFound() throws Exception {
        given(employerProfileService.getEmployerProfile()).willThrow(new NotFoundException("NOT_FOUND", "Profile not found"));

        mockMvc.perform(get("/api/employer-profile"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser // This will now work
    void createEmployerProfile_shouldReturnCreatedProfile() throws Exception {
        given(employerProfileService.createEmployerProfile(any(CreateEmployerProfileRequest.class))).willReturn(employerProfileResponse);

        mockMvc.perform(post("/api/employer-profile")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.companyName").value("Test Corp"));
    }

    @Test
    @WithMockUser // This will now work
    void createEmployerProfile_shouldReturnBadRequest_whenRequestInvalid() throws Exception {
        CreateEmployerProfileRequest invalidRequest = new CreateEmployerProfileRequest(); // no userId or employerType

        mockMvc.perform(post("/api/employer-profile")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser // This will now work
    void updateEmployerProfile_shouldReturnUpdatedProfile() throws Exception {
        given(employerProfileService.updateEmployerProfile(any(CreateEmployerProfileRequest.class))).willReturn(employerProfileResponse);

        mockMvc.perform(put("/api/employer-profile")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.companyName").value("Test Corp"));
    }

    @Test
    @WithMockUser // This will now work
    void updateEmployerProfile_shouldReturnNotFound_whenNotFound() throws Exception {
        given(employerProfileService.updateEmployerProfile(any(CreateEmployerProfileRequest.class))).willThrow(new NotFoundException("NOT_FOUND", "Profile not found"));

        mockMvc.perform(put("/api/employer-profile")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isNotFound());
    }
}
