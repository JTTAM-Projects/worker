package com.jttam.glig.testdata;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.jttam.glig.domain.category.Category;
import com.jttam.glig.domain.location.Location;
import com.jttam.glig.domain.task.Task;
import com.jttam.glig.domain.task.TaskRepository;
import com.jttam.glig.domain.task.TaskStatus;
import com.jttam.glig.domain.user.User;

@Component
public class TaskTestData {

    private final TaskRepository taskRepository;

    public TaskTestData(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public Map<String, Task> createTestTasks(Map<String, User> users, Map<String, Location> locations,
            Map<String, Category> categories) {

        User user1 = users.get("user1");
        User user2 = users.get("user2");
        User user3 = users.get("user3");
        User user4 = users.get("user4");
        User auth0 = users.get("auth0");

        Location koeLocation = locations.get("koe");
        Location testiLocation = locations.get("testi");

        Category gardenCategory = categories.get("GARDEN");
        Category cleaningCategory = categories.get("CLEANING");
        Category movingCategory = categories.get("MOVING");
        Category otherCategory = categories.get("OTHER");

        Map<String, Task> tasks = new HashMap<>();

        // ACTIVE TASKS
        Task activeTask1 = new Task(
                "Leikkaa nurmikko",
                50,
                LocalDateTime.now().plusDays(2),
                LocalDateTime.now().plusDays(2).plusHours(3),
                TaskStatus.ACTIVE,
                "Omakotitalon pihan nurmikon leikkuu.",
                user1);
        activeTask1.getCategories().add(gardenCategory);
        activeTask1.getLocations().add(testiLocation);
        tasks.put("activeTask1", activeTask1);
        taskRepository.save(activeTask1);

        Task activeTask2 = new Task(
                "Ikkunoiden pesu",
                60,
                LocalDateTime.now().plusDays(5),
                LocalDateTime.now().plusDays(5).plusHours(4),
                TaskStatus.ACTIVE,
                "Kerrostaloasunnon ikkunoiden pesu.",
                user2);
        activeTask2.getCategories().add(cleaningCategory);
        activeTask2.getLocations().add(koeLocation);
        tasks.put("activeTask2", activeTask2);
        taskRepository.save(activeTask2);

        Task activeTask3 = new Task(
                "Kanna sohva",
                30,
                LocalDateTime.now().plusDays(1),
                LocalDateTime.now().plusDays(1).plusHours(1),
                TaskStatus.ACTIVE,
                "Sohvan kantaminen autoon.",
                user3);
        activeTask3.getCategories().add(movingCategory);
        activeTask3.getLocations().add(koeLocation);
        activeTask3.getLocations().add(testiLocation);
        tasks.put("activeTask3", activeTask3);
        taskRepository.save(activeTask3);

        Task activeTask4 = new Task(
                "Kokoa IKEA-lipasto",
                45,
                LocalDateTime.now().plusDays(3),
                LocalDateTime.now().plusDays(3).plusHours(2),
                TaskStatus.ACTIVE,
                "MALM-lipaston kokoaminen ohjeiden mukaan.",
                user4);
        activeTask4.getCategories().add(otherCategory);
        activeTask4.getLocations().add(koeLocation);
        tasks.put("activeTask4", activeTask4);
        taskRepository.save(activeTask4);

        Task activeTask5 = new Task(
                "Istuta kukkia",
                25,
                LocalDateTime.now().plusDays(4),
                LocalDateTime.now().plusDays(4).plusHours(2),
                TaskStatus.ACTIVE,
                "Kesäkukkien istutus parvekelaatikoihin.",
                user1);
        activeTask5.getCategories().add(gardenCategory);
        activeTask5.getLocations().add(testiLocation);
        tasks.put("activeTask5", activeTask5);
        taskRepository.save(activeTask5);

        Task activeTask6 = new Task(
                "Imuroi asunto",
                35,
                LocalDateTime.now().plusDays(6),
                LocalDateTime.now().plusDays(6).plusHours(2),
                TaskStatus.ACTIVE,
                "Kaksion imurointi.",
                user2);
        activeTask6.getCategories().add(cleaningCategory);
        activeTask6.getLocations().add(koeLocation);
        tasks.put("activeTask6", activeTask6);
        taskRepository.save(activeTask6);

        Task activeTask7 = new Task(
                "Vie vanha sänky kaatopaikalle",
                50,
                LocalDateTime.now().plusDays(7),
                LocalDateTime.now().plusDays(7).plusHours(2),
                TaskStatus.ACTIVE,
                "Vanhan 120cm sängyn vienti kaatopaikalle. Peräkärry vaaditaan.",
                user3);
        activeTask7.getCategories().add(movingCategory);
        activeTask7.getLocations().add(testiLocation);
        tasks.put("activeTask7", activeTask7);
        taskRepository.save(activeTask7);

        Task activeTask8 = new Task(
                "Asenna palovaroitin",
                15,
                LocalDateTime.now().plusDays(8),
                LocalDateTime.now().plusDays(8).plusHours(1),
                TaskStatus.ACTIVE,
                "Yhden palovaroittimen asennus kattoon.",
                user4);
        activeTask8.getCategories().add(otherCategory);
        activeTask8.getLocations().add(koeLocation);
        tasks.put("activeTask8", activeTask8);
        taskRepository.save(activeTask8);

        // CANCELLED TASKS
        Task cancelledTask1 = new Task(
                "Leikkaa pensas",
                20,
                LocalDateTime.now().plusDays(2),
                LocalDateTime.now().plusDays(2).plusHours(3),
                TaskStatus.CANCELLED,
                "Omakotitalon pensaan leikkuu.",
                user1);
        cancelledTask1.getCategories().add(gardenCategory);
        cancelledTask1.getLocations().add(testiLocation);
        tasks.put("cancelledTask1", cancelledTask1);
        taskRepository.save(cancelledTask1);

        Task cancelledTask2 = new Task(
                "Maalaa aita",
                150,
                LocalDateTime.now().plusDays(10),
                LocalDateTime.now().plusDays(10).plusHours(8),
                TaskStatus.CANCELLED,
                "Puuaidan maalaus valkoiseksi.",
                user3);
        cancelledTask2.getCategories().add(otherCategory);
        cancelledTask2.getLocations().add(koeLocation);
        tasks.put("cancelledTask2", cancelledTask2);
        taskRepository.save(cancelledTask2);

        // IN_PROGRESS TASKS
        Task inProgressTask1 = new Task(
                "Siivoa autotalli",
                100,
                LocalDateTime.now().plusDays(1),
                LocalDateTime.now().plusDays(1).plusHours(5),
                TaskStatus.IN_PROGRESS,
                "Iso autotalli vaatii siivousta.",
                user1);
        inProgressTask1.getCategories().add(cleaningCategory);
        inProgressTask1.getLocations().add(testiLocation);
        tasks.put("inProgressTask1", inProgressTask1);
        taskRepository.save(inProgressTask1);

        Task inProgressTask2 = new Task(
                "Apua muutossa",
                120,
                LocalDateTime.now(),
                LocalDateTime.now().plusHours(6),
                TaskStatus.IN_PROGRESS,
                "Tarvitaan kantoapua muutossa.",
                user4);
        inProgressTask2.getCategories().add(movingCategory);
        inProgressTask2.getLocations().add(koeLocation);
        tasks.put("inProgressTask2", inProgressTask2);
        taskRepository.save(inProgressTask2);

        // COMPLETED TASKS
        Task completedTask1 = new Task(
                "Kanna laatikot",
                80,
                LocalDateTime.now().minusDays(5),
                LocalDateTime.now().minusDays(5).plusHours(4),
                TaskStatus.COMPLETED,
                "Muuttolaatikoiden kanto kolmanteen kerrokseen.",
                user1);
        completedTask1.getCategories().add(movingCategory);
        completedTask1.getLocations().add(testiLocation);
        tasks.put("completedTask1", completedTask1);
        taskRepository.save(completedTask1);

        Task completedTask2 = new Task(
                "Haravoi lehdet",
                40,
                LocalDateTime.now().minusDays(10),
                LocalDateTime.now().minusDays(10).plusHours(2),
                TaskStatus.COMPLETED,
                "Pihan lehtien haravointi ja poisvienti.",
                user2);
        completedTask2.getCategories().add(gardenCategory);
        completedTask2.getLocations().add(koeLocation);
        tasks.put("completedTask2", completedTask2);
        taskRepository.save(completedTask2);

        // EXPIRED TASKS
        Task expiredTask1 = new Task(
                "Koiran ulkoilutus",
                15,
                LocalDateTime.now().minusDays(1),
                LocalDateTime.now().minusDays(1).plusHours(1),
                TaskStatus.EXPIRED,
                "Koiran ulkoilutus tunnin ajan.",
                user1);
        expiredTask1.getCategories().add(otherCategory);
        expiredTask1.getLocations().add(testiLocation);
        tasks.put("expiredTask1", expiredTask1);
        taskRepository.save(expiredTask1);

        Task expiredTask2 = new Task(
                "Pölyjen pyyhintä",
                30,
                LocalDateTime.now().minusDays(3),
                LocalDateTime.now().minusDays(3).plusHours(2),
                TaskStatus.EXPIRED,
                "Koko asunnon pölyjen pyyhintä.",
                user4);
        expiredTask2.getCategories().add(cleaningCategory);
        expiredTask2.getLocations().add(koeLocation);
        tasks.put("expiredTask2", expiredTask2);
        taskRepository.save(expiredTask2);

        // auth0 user tasks

        // 3 ACTIVE tasks for auth0user
        Task auth0ActiveTask1 = new Task(
                "Kitke rikkaruohot",
                30,
                LocalDateTime.now().plusDays(5),
                LocalDateTime.now().plusDays(5).plusHours(2),
                TaskStatus.ACTIVE,
                "Rikkaruohojen kitkeminen kasvimaalta.",
                auth0);
        auth0ActiveTask1.getCategories().add(gardenCategory);
        auth0ActiveTask1.getLocations().add(testiLocation);
        tasks.put("auth0ActiveTask1", auth0ActiveTask1);
        taskRepository.save(auth0ActiveTask1);

        Task auth0ActiveTask2 = new Task(
                "Pese sauna",
                40,
                LocalDateTime.now().plusDays(10),
                LocalDateTime.now().plusDays(10).plusHours(2),
                TaskStatus.ACTIVE,
                "Saunan lauteiden ja lattian pesu.",
                auth0);
        auth0ActiveTask2.getCategories().add(cleaningCategory);
        auth0ActiveTask2.getLocations().add(koeLocation);
        tasks.put("auth0ActiveTask2", auth0ActiveTask2);
        taskRepository.save(auth0ActiveTask2);

        Task auth0ActiveTask3 = new Task(
                "Vie roskat",
                10,
                LocalDateTime.now().plusDays(1),
                LocalDateTime.now().plusDays(1).plusHours(1),
                TaskStatus.ACTIVE,
                "Sekajäteastian vienti ulos.",
                auth0);
        auth0ActiveTask3.getCategories().add(otherCategory);
        auth0ActiveTask3.getLocations().add(testiLocation);
        tasks.put("auth0ActiveTask3", auth0ActiveTask3);
        taskRepository.save(auth0ActiveTask3);

        // IN_PROGRESS task for auth0user
        Task auth0InProgressTask = new Task(
                "Kokoa sänky",
                50,
                LocalDateTime.now(),
                LocalDateTime.now().plusHours(3),
                TaskStatus.IN_PROGRESS,
                "Uuden sängyn kokoaminen.",
                auth0);
        auth0InProgressTask.getCategories().add(movingCategory);
        auth0InProgressTask.getLocations().add(koeLocation);
        tasks.put("auth0InProgressTask", auth0InProgressTask);
        taskRepository.save(auth0InProgressTask);

        // COMPLETED task for auth0user
        Task auth0CompletedTask = new Task(
                "Vaihda lamppu",
                15,
                LocalDateTime.now().minusDays(7),
                LocalDateTime.now().minusDays(7).plusHours(1),
                TaskStatus.COMPLETED,
                "Keittiön lampun vaihto.",
                auth0);
        auth0CompletedTask.getCategories().add(otherCategory);
        auth0CompletedTask.getLocations().add(testiLocation);
        tasks.put("auth0CompletedTask", auth0CompletedTask);
        taskRepository.save(auth0CompletedTask);

        // CANCELLED task for auth0user
        Task auth0CancelledTask = new Task(
                "Puhdista rännit",
                60,
                LocalDateTime.now().plusDays(3),
                LocalDateTime.now().plusDays(3).plusHours(2),
                TaskStatus.CANCELLED,
                "Omakotitalon rännien puhdistus.",
                auth0);
        auth0CancelledTask.getCategories().add(cleaningCategory);
        auth0CancelledTask.getLocations().add(koeLocation);
        tasks.put("auth0CancelledTask", auth0CancelledTask);
        taskRepository.save(auth0CancelledTask);

        // EXPIRED task for auth0user
        Task auth0ExpiredTask = new Task(
                "Kastele kukat",
                10,
                LocalDateTime.now().minusDays(2),
                LocalDateTime.now().minusDays(2).plusHours(1),
                TaskStatus.EXPIRED,
                "Sisäkukkien kastelu.",
                auth0);
        auth0ExpiredTask.getCategories().add(gardenCategory);
        auth0ExpiredTask.getLocations().add(testiLocation);
        tasks.put("auth0ExpiredTask", auth0ExpiredTask);
        taskRepository.save(auth0ExpiredTask);

        return tasks;
    }

    public void cleanUp() {
        taskRepository.deleteAll();
    }
}
