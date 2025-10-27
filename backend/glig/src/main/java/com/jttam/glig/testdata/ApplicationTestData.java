package com.jttam.glig.testdata;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.jttam.glig.domain.application.Application;
import com.jttam.glig.domain.application.ApplicationRepository;
import com.jttam.glig.domain.application.ApplicationStatus;
import com.jttam.glig.domain.task.Task;
import com.jttam.glig.domain.user.User;

@Component
public class ApplicationTestData {

    private final ApplicationRepository applicationRepository;

    public ApplicationTestData(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    public Map<String, Application> createTestApplications(Map<String, User> users, Map<String, Task> tasks) {
        applicationRepository.deleteAll();

        User user2 = users.get("user2");
        User user3 = users.get("user3");
        User auth0 = users.get("auth0");

        // Get the specific manual tasks we kept
        Task auth0ActiveTask = tasks.get("auth0ActiveTask");
        Task multiLocationTask = tasks.get("multiLocationTask");
        Task inProgressTask = tasks.get("inProgressTask");

        Map<String, Application> applications = new HashMap<>();

        // Create a few test applications on the manual tasks
        if (auth0ActiveTask != null) {
            Application pending1 = applicationRepository
                    .save(new Application(user2, auth0ActiveTask, 25, LocalDateTime.now(),
                            "Voin hoitaa tämän keikan.", ApplicationStatus.PENDING));
            applications.put("pending1", pending1);
        }

        if (multiLocationTask != null) {
            Application accepted1 = applicationRepository
                    .save(new Application(user3, multiLocationTask, 30, LocalDateTime.now(),
                            "Voin aloittaa heti.", ApplicationStatus.ACCEPTED));
            applications.put("accepted1", accepted1);
        }

        if (inProgressTask != null) {
            Application cancelled1 = applicationRepository
                    .save(new Application(user2, inProgressTask, 90, LocalDateTime.now(),
                            "Minulle tuli este.", ApplicationStatus.CANCELLED));
            applications.put("cancelled1", cancelled1);
        }

        // Create some applications on bulk tasks for auth0 user (for testing)
        int appCount = 0;
        for (Map.Entry<String, Task> entry : tasks.entrySet()) {
            if (entry.getKey().startsWith("bulkTask") && appCount < 10) {
                Task bulkTask = entry.getValue();
                ApplicationStatus[] statuses = {
                        ApplicationStatus.PENDING, ApplicationStatus.ACCEPTED,
                        ApplicationStatus.REJECTED, ApplicationStatus.CANCELLED
                };
                ApplicationStatus status = statuses[appCount % statuses.length];

                Application app = applicationRepository
                        .save(new Application(auth0, bulkTask, bulkTask.getPrice(),
                                LocalDateTime.now(), "Test application " + (appCount + 1), status));
                applications.put("testApplication" + (appCount + 1), app);
                appCount++;
            }
        }

        return applications;
    }

    public void cleanUp() {
        applicationRepository.deleteAll();
    }
}
