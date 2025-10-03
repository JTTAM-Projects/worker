package com.jttam.glig.domain.apply;

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

import jakarta.transaction.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class ApplyIntegrationTest {

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

        Long grassTaskId = taskRepository.findByTitle("Leikkaa nurmikko").get(0).getId();

        mockMvc.perform(get("/api/apply/task/" + grassTaskId)
                .with(jwt().jwt(user2Jwt))
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.task.title").value("Leikkaa nurmikko"));
    }

    @Test
    void GetPageOfTasksByGivenCorrectUserNameAndSortindAndFilteringParameters() throws Exception {

        testDataService.consoleLogDataBase();

        mockMvc.perform(get("/api/apply/user-applies?applyStatus=CANCELLED")
                .with(jwt().jwt(user2Jwt))
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("totalElements").value(2));
    }

}
