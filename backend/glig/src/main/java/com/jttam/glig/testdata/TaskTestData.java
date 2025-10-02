package com.jttam.glig.testdata;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.jttam.glig.domain.task.Category;
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

    public Map<String, Task> createTestTasks(Map<String, User> users) {
        User user1 = users.get("user1");
        User user2 = users.get("user2");
        User user3 = users.get("user3");
        User user4 = users.get("user4");

        Map<String, Task> tasks = new HashMap<>();

        // ACTIVE TASKS
        Task activeTask1 = taskRepository.save(new Task(
                Category.GARDEN,
                "Leikkaa nurmikko",
                50,
                LocalDateTime.now().plusDays(2),
                LocalDateTime.now().plusDays(2).plusHours(3),
                "Testikatu 1, Helsinki",
                TaskStatus.ACTIVE,
                "Omakotitalon pihan nurmikon leikkuu.",
                user1));
        tasks.put("activeTask1", activeTask1);

        Task activeTask2 = taskRepository.save(new Task(
                Category.CLEANING,
                "Ikkunoiden pesu",
                60,
                LocalDateTime.now().plusDays(5),
                LocalDateTime.now().plusDays(5).plusHours(4),
                "Esimerkkitie 5, Espoo",
                TaskStatus.ACTIVE,
                "Kerrostaloasunnon ikkunoiden pesu.",
                user2));
        tasks.put("activeTask2", activeTask2);

        Task activeTask3 = taskRepository.save(new Task(
                Category.MOVING,
                "Kanna sohva",
                30,
                LocalDateTime.now().plusDays(1),
                LocalDateTime.now().plusDays(1).plusHours(1),
                "Huonekalutie 3, Vantaa",
                TaskStatus.ACTIVE,
                "Sohvan kantaminen autoon.",
                user3));
        tasks.put("activeTask3", activeTask3);

        Task activeTask4 = taskRepository.save(new Task(
                Category.OTHER,
                "Kokoa IKEA-lipasto",
                45,
                LocalDateTime.now().plusDays(3),
                LocalDateTime.now().plusDays(3).plusHours(2),
                "Sisustajankuja 7, Helsinki",
                TaskStatus.ACTIVE,
                "MALM-lipaston kokoaminen ohjeiden mukaan.",
                user4));
        tasks.put("activeTask4", activeTask4);

        Task activeTask5 = taskRepository.save(new Task(
                Category.GARDEN,
                "Istuta kukkia",
                25,
                LocalDateTime.now().plusDays(4),
                LocalDateTime.now().plusDays(4).plusHours(2),
                "Kukkakuja 1, Espoo",
                TaskStatus.ACTIVE,
                "Kesäkukkien istutus parvekelaatikoihin.",
                user1));
        tasks.put("activeTask5", activeTask5);

        Task activeTask6 = taskRepository.save(new Task(
                Category.CLEANING,
                "Imuroi asunto",
                35,
                LocalDateTime.now().plusDays(6),
                LocalDateTime.now().plusDays(6).plusHours(2),
                "Pölytie 2, Helsinki",
                TaskStatus.ACTIVE,
                "Kaksion imurointi.",
                user2));
        tasks.put("activeTask6", activeTask6);

        Task activeTask7 = taskRepository.save(new Task(
                Category.MOVING,
                "Vie vanha sänky kaatopaikalle",
                50,
                LocalDateTime.now().plusDays(7),
                LocalDateTime.now().plusDays(7).plusHours(2),
                "Kierrätyskeskus, Vantaa",
                TaskStatus.ACTIVE,
                "Vanhan 120cm sängyn vienti kaatopaikalle. Peräkärry vaaditaan.",
                user3));
        tasks.put("activeTask7", activeTask7);

        Task activeTask8 = taskRepository.save(new Task(
                Category.OTHER,
                "Asenna palovaroitin",
                15,
                LocalDateTime.now().plusDays(8),
                LocalDateTime.now().plusDays(8).plusHours(1),
                "Turvakuja 1, Espoo",
                TaskStatus.ACTIVE,
                "Yhden palovaroittimen asennus kattoon.",
                user4));
        tasks.put("activeTask8", activeTask8);

        // CANCELLED TASKS
        Task cancelledTask1 = taskRepository.save(new Task(
                Category.GARDEN,
                "Leikkaa pensas",
                20,
                LocalDateTime.now().plusDays(2),
                LocalDateTime.now().plusDays(2).plusHours(3),
                "Testikatu 2, Helsinki",
                TaskStatus.CANCELLED,
                "Omakotitalon pensaan leikkuu.",
                user1));
        tasks.put("cancelledTask1", cancelledTask1);

        Task cancelledTask2 = taskRepository.save(new Task(
                Category.OTHER,
                "Maalaa aita",
                150,
                LocalDateTime.now().plusDays(10),
                LocalDateTime.now().plusDays(10).plusHours(8),
                "Maalarinkuja 1, Vantaa",
                TaskStatus.CANCELLED,
                "Puuaidan maalaus valkoiseksi.",
                user3));
        tasks.put("cancelledTask2", cancelledTask2);

        // IN_PROGRESS TASKS
        Task inProgressTask1 = taskRepository.save(new Task(
                Category.CLEANING,
                "Siivoa autotalli",
                100,
                LocalDateTime.now().plusDays(1),
                LocalDateTime.now().plusDays(1).plusHours(5),
                "Esimerkkikatu 3, Vantaa",
                TaskStatus.IN_PROGRESS,
                "Iso autotalli vaatii siivousta.",
                user1));
        tasks.put("inProgressTask1", inProgressTask1);

        Task inProgressTask2 = taskRepository.save(new Task(
                Category.MOVING,
                "Apua muutossa",
                120,
                LocalDateTime.now(),
                LocalDateTime.now().plusHours(6),
                "Muuttotie 12, Helsinki",
                TaskStatus.IN_PROGRESS,
                "Tarvitaan kantoapua muutossa.",
                user4));
        tasks.put("inProgressTask2", inProgressTask2);

        // COMPLETED TASKS
        Task completedTask1 = taskRepository.save(new Task(
                Category.MOVING,
                "Kanna laatikot",
                80,
                LocalDateTime.now().minusDays(5),
                LocalDateTime.now().minusDays(5).plusHours(4),
                "Testitie 4, Espoo",
                TaskStatus.COMPLETED,
                "Muuttolaatikoiden kanto kolmanteen kerrokseen.",
                user1));
        tasks.put("completedTask1", completedTask1);

        Task completedTask2 = taskRepository.save(new Task(
                Category.GARDEN,
                "Haravoi lehdet",
                40,
                LocalDateTime.now().minusDays(10),
                LocalDateTime.now().minusDays(10).plusHours(2),
                "Puistotie 1, Helsinki",
                TaskStatus.COMPLETED,
                "Pihan lehtien haravointi ja poisvienti.",
                user2));
        tasks.put("completedTask2", completedTask2);

        // EXPIRED TASKS
        Task expiredTask1 = taskRepository.save(new Task(
                Category.OTHER,
                "Koiran ulkoilutus",
                15,
                LocalDateTime.now().minusDays(1),
                LocalDateTime.now().minusDays(1).plusHours(1),
                "Testikatu 1, Helsinki",
                TaskStatus.EXPIRED,
                "Koiran ulkoilutus tunnin ajan.",
                user1));
        tasks.put("expiredTask1", expiredTask1);

        Task expiredTask2 = taskRepository.save(new Task(
                Category.CLEANING,
                "Pölyjen pyyhintä",
                30,
                LocalDateTime.now().minusDays(3),
                LocalDateTime.now().minusDays(3).plusHours(2),
                "Siivouskuja 8, Espoo",
                TaskStatus.EXPIRED,
                "Koko asunnon pölyjen pyyhintä.",
                user4));
        tasks.put("expiredTask2", expiredTask2);

        return tasks;
    }

    public void cleanUp() {
        taskRepository.deleteAll();
    }
}
