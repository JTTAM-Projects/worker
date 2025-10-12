package com.jttam.glig.domain.task;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import org.springframework.http.MediaType;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import com.jttam.glig.testdata.TestDataService;

@SpringBootTest
@AutoConfigureMockMvc
public class TaskIntegrationTest {

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
    void getTasks_withCategoryFilter_returnsFilteredTasks() throws Exception {

        String categoryToFilterBy = "Garden";
        int expectedTaskCountForUser1InCategoryA = 6;

        mockMvc.perform(get("/api/task/all-tasks")
                .param("categoryTitle", categoryToFilterBy)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(expectedTaskCountForUser1InCategoryA))
                .andExpect(jsonPath("$.totalElements").value(expectedTaskCountForUser1InCategoryA))
                .andExpect(jsonPath("$.content[0].categories[0].title").value(categoryToFilterBy));
    }

    @Test
    void getTasks_withNonExistentCategoryFilter_returnsEmptyList() throws Exception {
        String nonExistentCategory = "Non Existent Category";

        mockMvc.perform(get("/api/task/all-tasks")
                .param("categoryTitle", nonExistentCategory)
                .with(jwt().jwt(user1Jwt))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(0))
                .andExpect(jsonPath("$.totalElements").value(0));
    }

    @Test
    void getTasks_withoutCategoryFilterOrPageable_returnsAllUserTasksWithDefaultPageableSettings() throws Exception {

        int expectedTaskCountForUser1 = 6;

        mockMvc.perform(get("/api/task/user-tasks")
                .with(jwt().jwt(user1Jwt))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(expectedTaskCountForUser1))
                .andExpect(jsonPath("$.totalElements").value(expectedTaskCountForUser1));
    }

    @Test
    void getTasks_withCategoryFilterWithoutPageable_returnsFilteredUserTasksWithDefaultPageableSettings()
            throws Exception {

        String categoryToFilterBy = "Garden";
        int expectedTaskCountForUser1InCategoryA = 3;

        mockMvc.perform(get("/api/task/user-tasks")
                .param("categoryTitle", categoryToFilterBy)
                .with(jwt().jwt(user1Jwt))
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(expectedTaskCountForUser1InCategoryA))
                .andExpect(jsonPath("$.totalElements").value(expectedTaskCountForUser1InCategoryA))
                .andExpect(jsonPath("$.content[0].categories[0].title").value(categoryToFilterBy));
    }
}
