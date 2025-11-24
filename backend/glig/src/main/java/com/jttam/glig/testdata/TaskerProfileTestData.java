package com.jttam.glig.testdata;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.jttam.glig.domain.taskerprofile.TaskerProfile;
import com.jttam.glig.domain.taskerprofile.TaskerProfileRepository;
import com.jttam.glig.domain.user.User;

@Component
public class TaskerProfileTestData {

    private TaskerProfileRepository taskerProfileRepository;

    public TaskerProfileTestData(TaskerProfileRepository taskerProfileRepository) {
        this.taskerProfileRepository = taskerProfileRepository;
    }

    public Map<String, TaskerProfile> createTestTaskerProfiles(Map<String, User> users) {
        Map<String, TaskerProfile> taskerProfiles = new HashMap<>();

        // Create tasker profile for auth0 test user
        User auth0User = users.get("auth0");
        if (auth0User != null) {
            TaskerProfile auth0TaskerProfile = new TaskerProfile(
                    auth0User,
                    "Työkatu 10",
                    "00100",
                    "Helsinki",
                    "Finland",
                    "Experienced worker available for various tasks",
                    "https://myportfolio.fi",
                    "https://via.placeholder.com/150",
                    false,
                    new BigDecimal("4.50"));
            auth0TaskerProfile.setFirstName("Test");
            auth0TaskerProfile.setLastName("Worker");
            taskerProfiles.put("auth0Tasker", taskerProfileRepository.save(auth0TaskerProfile));
        }

        // Create tasker profile for user2
        User user2 = users.get("user2");
        if (user2 != null) {
            TaskerProfile user2TaskerProfile = new TaskerProfile(
                    user2,
                    "Duunarikatu 3",
                    "00300",
                    "Vantaa",
                    "Finland",
                    "Skilled tasker with 5 years of experience",
                    "https://worker2.fi",
                    "https://via.placeholder.com/150",
                    true,
                    new BigDecimal("4.80"));
            user2TaskerProfile.setFirstName("Liisa");
            user2TaskerProfile.setLastName("Työläinen");
            taskerProfiles.put("user2Tasker", taskerProfileRepository.save(user2TaskerProfile));
        }

        return taskerProfiles;
    }

    public void cleanUp() {
        taskerProfileRepository.deleteAll();
    }
}
