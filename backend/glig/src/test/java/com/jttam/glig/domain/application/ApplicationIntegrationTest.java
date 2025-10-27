package com.jttam.glig.domain.application;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.test.web.servlet.MockMvc;

import com.jttam.glig.domain.task.TaskRepository;
import com.jttam.glig.testdata.TestDataService;

@SpringBootTest
@AutoConfigureMockMvc
public class ApplicationIntegrationTest {

    @Autowired
    TaskRepository taskRepository;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TestDataService testDataService;

    private Jwt user1Jwt;
    private Jwt user2Jwt;

    private final String user1 = "User1";
    private final String user2 = "User2";

    @BeforeEach
    void setUp() {
        testDataService.createAllTestData();

        user1Jwt = Jwt.withTokenValue("token")
                .header("alg", "none")
                .claim("sub", user1)
                .build();

        user2Jwt = Jwt.withTokenValue("token")
                .header("alg", "none")
                .claim("sub", user2)
                .build();
    }

    @Test
    void GetApplyByGivenCorrectTaskIdAndCorrectUserName() throws Exception {

        // Find the inProgressTask (a manually created task that has an application from User2)
        Long inProgressTaskId = taskRepository.findByTitle("Siivoa autotalli").get(0).getId();

        mockMvc.perform(get("/api/task/" + inProgressTaskId + "/application")
                .with(jwt().jwt(user2Jwt))
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.task.title").value("Siivoa autotalli"));
    }

    @Test
    void GetPageOfApplicationsByGivenCorrectUserNameAndFilteringParameters() throws Exception {

        // User2 has 1 CANCELLED application on the inProgressTask
        mockMvc.perform(get("/api/user-applications?applicationStatus=CANCELLED")
                .with(jwt().jwt(user2Jwt))
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("totalElements").value(1));
    }

}
