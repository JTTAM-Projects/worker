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
        User user4 = users.get("user4");
        User auth0 = users.get("auth0");

        Task activeTask1 = tasks.get("activeTask1");
        Task activeTask2 = tasks.get("activeTask2");
        Task activeTask3 = tasks.get("activeTask3");
        Task activeTask4 = tasks.get("activeTask4");
        Task activeTask5 = tasks.get("activeTask5");
        Task activeTask6 = tasks.get("activeTask6");
        Task activeTask7 = tasks.get("activeTask7");
        Task activeTask8 = tasks.get("activeTask8");
        Task cancelledTask1 = tasks.get("cancelledTask1");
        Task cancelledTask2 = tasks.get("cancelledTask2");
        Task inProgressTask1 = tasks.get("inProgressTask1");
        Task inProgressTask2 = tasks.get("inProgressTask2");
        Task completedTask1 = tasks.get("completedTask1");
        Task completedTask2 = tasks.get("completedTask2");
        Task expiredTask1 = tasks.get("expiredTask1");
        Task expiredTask2 = tasks.get("expiredTask2");

        Map<String, Application> applications = new HashMap<>();

        // PENDING APPLICATIONS
        Application pending1 = applicationRepository
                .save(new Application(user2, activeTask1, 45, LocalDateTime.now().plusDays(2),
                        "Olen kokenut nurmikonleikkaaja ja hoidan homman nopeasti.", ApplicationStatus.PENDING));
        applications.put("pending1", pending1);

        Application pending2 = applicationRepository
                .save(new Application(user3, activeTask1, 50, LocalDateTime.now().plusDays(3),
                        "Voin leikata nurmikon, kokemusta on.", ApplicationStatus.PENDING));
        applications.put("pending2", pending2);

        // ACCEPTED APPLICATIONS
        Application accepted1 = applicationRepository
                .save(new Application(user3, activeTask2, 90, LocalDateTime.now().plusDays(1),
                        "Voin aloittaa heti.", ApplicationStatus.ACCEPTED));
        applications.put("accepted1", accepted1);

        // REJECTED APPLICATIONS
        Application rejected1 = applicationRepository
                .save(new Application(user4, activeTask1, 55, LocalDateTime.now().plusDays(2),
                        "Hoidan homman.", ApplicationStatus.REJECTED));
        applications.put("rejected1", rejected1);

        // CANCELLED APPLICATIONS
        Application cancelled1 = applicationRepository
                .save(new Application(user2, inProgressTask1, 90, LocalDateTime.now().plusDays(1),
                        "Minulle tuli este.", ApplicationStatus.CANCELLED));
        applications.put("cancelled1", cancelled1);

        Application cancelled2 = applicationRepository
                .save(new Application(user4, completedTask2, 60, LocalDateTime.now().minusDays(2),
                        "En ehdikään.", ApplicationStatus.CANCELLED));
        applications.put("cancelled2", cancelled2);

        Application cancelled3 = applicationRepository
                .save(new Application(user2, completedTask2, 60, LocalDateTime.now().minusDays(2),
                        "En ehdikään.", ApplicationStatus.CANCELLED));
        applications.put("cancelled3", cancelled3);

        // auth0 test -user applications
        Application testApplication1 = applicationRepository
                .save(new Application(auth0, activeTask1, 50, LocalDateTime.now(),
                        "Test user apply 1", ApplicationStatus.PENDING));
        applications.put("testApplication1", testApplication1);

        Application testApplication2 = applicationRepository
                .save(new Application(auth0, activeTask2, 60, LocalDateTime.now(),
                        "Test user apply 2", ApplicationStatus.ACCEPTED));
        applications.put("testApplication2", testApplication2);

        Application testApplication3 = applicationRepository
                .save(new Application(auth0, activeTask3, 30, LocalDateTime.now(),
                        "Test user apply 3", ApplicationStatus.REJECTED));
        applications.put("testApplication3", testApplication3);

        Application testApplication4 = applicationRepository
                .save(new Application(auth0, activeTask4, 45, LocalDateTime.now(),
                        "Test user apply 4", ApplicationStatus.CANCELLED));
        applications.put("testApplication4", testApplication4);

        Application testApplication5 = applicationRepository
                .save(new Application(auth0, activeTask5, 25, LocalDateTime.now(),
                        "Test user apply 5", ApplicationStatus.PENDING));
        applications.put("testApplication5", testApplication5);

        Application testApplication6 = applicationRepository
                .save(new Application(auth0, activeTask6, 35, LocalDateTime.now(),
                        "Test user apply 6", ApplicationStatus.ACCEPTED));
        applications.put("testApplication6", testApplication6);

        Application testApplication7 = applicationRepository
                .save(new Application(auth0, activeTask7, 50, LocalDateTime.now(),
                        "Test user apply 7", ApplicationStatus.REJECTED));
        applications.put("testApplication7", testApplication7);

        Application testApplication8 = applicationRepository
                .save(new Application(auth0, activeTask8, 15, LocalDateTime.now(),
                        "Test user apply 8", ApplicationStatus.CANCELLED));
        applications.put("testApplication8", testApplication8);

        Application testApplication9 = applicationRepository
                .save(new Application(auth0, cancelledTask1, 20, LocalDateTime.now(),
                        "Test user apply 9", ApplicationStatus.PENDING));
        applications.put("testApplication9", testApplication9);

        Application testApplication10 = applicationRepository
                .save(new Application(auth0, cancelledTask2, 150, LocalDateTime.now(),
                        "Test user apply 10", ApplicationStatus.ACCEPTED));
        applications.put("testApplication10", testApplication10);

        Application testApplication11 = applicationRepository
                .save(new Application(auth0, inProgressTask1, 100, LocalDateTime.now(),
                        "Test user apply 11", ApplicationStatus.REJECTED));
        applications.put("testApplication11", testApplication11);

        Application testApplication12 = applicationRepository
                .save(new Application(auth0, inProgressTask2, 120, LocalDateTime.now(),
                        "Test user apply 12", ApplicationStatus.CANCELLED));
        applications.put("testApplication12", testApplication12);

        Application testApplication13 = applicationRepository
                .save(new Application(auth0, completedTask1, 80, LocalDateTime.now(),
                        "Test user apply 13", ApplicationStatus.PENDING));
        applications.put("testApplication13", testApplication13);

        Application testApplication14 = applicationRepository
                .save(new Application(auth0, completedTask2, 40, LocalDateTime.now(),
                        "Test user apply 14", ApplicationStatus.ACCEPTED));
        applications.put("testApplication14", testApplication14);

        Application testApplication15 = applicationRepository
                .save(new Application(auth0, expiredTask1, 15, LocalDateTime.now(),
                        "Test user apply 15", ApplicationStatus.REJECTED));
        applications.put("testApplication15", testApplication15);

        Application testApplication16 = applicationRepository
                .save(new Application(auth0, expiredTask2, 30, LocalDateTime.now(),
                        "Test user apply 16", ApplicationStatus.CANCELLED));
        applications.put("testApplication16", testApplication16);

        return applications;
    }

    public void cleanUp() {
        applicationRepository.deleteAll();
    }
}
