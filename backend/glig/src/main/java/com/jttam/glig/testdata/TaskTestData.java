package com.jttam.glig.testdata;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

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
    private final LocationTestData locationTestData;
    private final Random random = new Random();

    // Task templates for each category
    private final List<TaskTemplate> gardenTasks = Arrays.asList(
            new TaskTemplate("Leikkaa nurmikko", "Nurmikon leikkuu ja reunojen siistiminen.", 40, 60, 2, 4),
            new TaskTemplate("Istuta kukkia", "Kesäkukkien istutus parvekelaatikoihin tai puutarhaan.", 25, 35, 1, 3),
            new TaskTemplate("Kitke rikkaruohot", "Rikkaruohojen kitkeminen kasvimaalta tai kukkapenkeistä.", 30, 50, 2, 3),
            new TaskTemplate("Haravoi lehdet", "Pihan lehtien haravointi ja poisvienti.", 35, 55, 2, 4),
            new TaskTemplate("Kastele kasvit", "Puutarhan ja parvekekasvien kastelu.", 15, 25, 1, 2),
            new TaskTemplate("Leikkaa pensas", "Pensaiden ja pensasaidan leikkuu.", 40, 70, 2, 4),
            new TaskTemplate("Lannoita nurmikko", "Nurmikon kevät- tai kesälannoitus.", 30, 50, 2, 3),
            new TaskTemplate("Kylvä siemeniä", "Kukkien tai vihannesten siementen kylvö.", 20, 40, 1, 3)
    );

    private final List<TaskTemplate> yardTasks = Arrays.asList(
            new TaskTemplate("Lakaitse piha", "Pihan lakaiseminen ja siistiminen.", 25, 45, 1, 3),
            new TaskTemplate("Rakenna terassi", "Puuterassin rakentaminen pihalle.", 200, 400, 8, 16),
            new TaskTemplate("Rakenna polttopuuvaja", "Polttopuuvajan rakentaminen takapihalle.", 150, 300, 6, 12),
            new TaskTemplate("Korjaa aita", "Rikkinäisen puuaidan korjaus.", 80, 120, 4, 6),
            new TaskTemplate("Siisti pihavarastopiha", "Pihavaraston järjestely ja siistiminen.", 40, 70, 2, 4),
            new TaskTemplate("Puhdista sadevesikaivot", "Pihan sadevesikaivojen puhdistus.", 30, 50, 1, 2),
            new TaskTemplate("Rakenna kompostori", "Kompostorin rakentaminen takapihalle.", 60, 100, 3, 5)
    );

    private final List<TaskTemplate> forestWorkTasks = Arrays.asList(
            new TaskTemplate("Kaada puita", "Puiden kaato ja pilkkominen.", 100, 200, 4, 8),
            new TaskTemplate("Raivaa pensaikkoa", "Pensaikon raivaus metsäalueelta.", 80, 150, 4, 6),
            new TaskTemplate("Pilko polttopuita", "Polttopuiden pilkkominen ja pinominen.", 60, 120, 3, 6),
            new TaskTemplate("Kuljeta hakkeet", "Hakekuorman kuljetus ja levitys.", 70, 130, 3, 5),
            new TaskTemplate("Merkitse puut", "Kaadettavien puiden merkitseminen.", 40, 80, 2, 4),
            new TaskTemplate("Raivaa oksia", "Kaatuneiden oksien raivaus metsästä.", 50, 100, 2, 5)
    );

    private final List<TaskTemplate> householdTasks = Arrays.asList(
            new TaskTemplate("Kokoa huonekalut", "IKEA-huonekalujen kokoaminen.", 40, 80, 2, 4),
            new TaskTemplate("Ripusta verhot", "Verhojen ja kappa-pitojen asennus.", 30, 50, 1, 3),
            new TaskTemplate("Järjestä vaatehuone", "Vaatehuoneen järjestely ja organisointi.", 50, 90, 2, 4),
            new TaskTemplate("Kokoa säilytyskalusteet", "Säilytyskaapiston kokoaminen makuuhuoneeseen.", 35, 65, 2, 3),
            new TaskTemplate("Asenna hyllyt", "Seinähyllyjen asennus ja kiinnitys.", 40, 70, 2, 3),
            new TaskTemplate("Ripusta taulut", "Taulujen ja kehysten ripustus seinille.", 25, 45, 1, 2),
            new TaskTemplate("Järjestä varastokomero", "Varastokaapin siivous ja organisointi.", 35, 60, 2, 3)
    );

    private final List<TaskTemplate> cleaningTasks = Arrays.asList(
            new TaskTemplate("Siivoa keittiö", "Keittiön perusteellinen siivous.", 40, 70, 2, 3),
            new TaskTemplate("Pese ikkunat", "Ikkunoiden pesu sisältä ja ulkoa.", 50, 90, 2, 4),
            new TaskTemplate("Imuroi asunto", "Koko asunnon imurointi.", 30, 60, 1, 3),
            new TaskTemplate("Pyyhi pölyt", "Huonekalujen ja pintojen pölyjen pyyhintä.", 25, 45, 1, 2),
            new TaskTemplate("Puhdista kylpyhuone", "Kylpyhuoneen perusteellinen puhdistus.", 40, 70, 2, 3),
            new TaskTemplate("Pese lattia", "Lattioiden peseminen kaikissa huoneissa.", 35, 65, 2, 3),
            new TaskTemplate("Siivoa autotalli", "Autotallin siivous ja järjestely.", 60, 120, 3, 5),
            new TaskTemplate("Pese sauna", "Saunan lauteiden ja lattian pesu.", 35, 60, 2, 3),
            new TaskTemplate("Puhdista uuni", "Uunin sisäpuolen puhdistus.", 30, 50, 1, 2),
            new TaskTemplate("Siivoa parvi", "Parven tai ullakontilan siivous.", 50, 100, 2, 5)
    );

    private final List<TaskTemplate> movingTasks = Arrays.asList(
            new TaskTemplate("Kanna laatikot", "Muuttolaatikoiden kantaminen portaissa.", 60, 120, 2, 5),
            new TaskTemplate("Kanna sohva", "Sohvan kantaminen autoon tai sisälle.", 30, 60, 1, 2),
            new TaskTemplate("Apua muutossa", "Yleinen kantoapu muutossa.", 80, 150, 4, 8),
            new TaskTemplate("Vie kaatopaikalle", "Vanhojen huonekalujen vienti kaatopaikalle.", 40, 80, 2, 4),
            new TaskTemplate("Pura huonekalut", "Huonekalujen purkaminen muuttoa varten.", 40, 70, 2, 3),
            new TaskTemplate("Pakkaustöitä", "Tavaroiden pakkaaminen muuttolaatikoihin.", 50, 90, 2, 4),
            new TaskTemplate("Kokoa sänky", "Sängyn kokoaminen uudessa asunnossa.", 40, 70, 2, 3),
            new TaskTemplate("Kuljeta pakettiauto", "Pakettiauton kuljetus muutossa.", 60, 100, 3, 5)
    );

    private final List<TaskTemplate> repairTasks = Arrays.asList(
            new TaskTemplate("Korjaa hana", "Vuotavan hanan korjaus.", 40, 70, 1, 2),
            new TaskTemplate("Vaihda lamppu", "Lampun tai valaisimen vaihto.", 15, 30, 1, 1),
            new TaskTemplate("Korjaa ovi", "Oven saranoiden tai lukon korjaus.", 50, 90, 2, 3),
            new TaskTemplate("Asenna palovaroitin", "Palovaroittimen asennus kattoon.", 20, 40, 1, 2),
            new TaskTemplate("Korjaa kaluste", "Rikkinäisen huonekalun korjaus.", 40, 80, 2, 4),
            new TaskTemplate("Vaihda pistorasia", "Seinäpistorasian vaihto.", 30, 60, 1, 2),
            new TaskTemplate("Korjaa ikkuna", "Ikkunan mekanismin korjaus.", 50, 100, 2, 3),
            new TaskTemplate("Asenna lukko", "Oven lukon asennus tai vaihto.", 40, 70, 1, 3)
    );

    private final List<TaskTemplate> paintingTasks = Arrays.asList(
            new TaskTemplate("Maalaa huone", "Yhden huoneen maalaus.", 100, 180, 4, 8),
            new TaskTemplate("Maalaa aita", "Puuaidan maalaus.", 120, 200, 5, 10),
            new TaskTemplate("Maalaa ovi", "Sisä- tai ulko-oven maalaus.", 50, 90, 2, 4),
            new TaskTemplate("Maalaa ikkunanpokat", "Ikkunanpokauksien maalaus.", 60, 100, 3, 5),
            new TaskTemplate("Maalaa katto", "Katon maalaus sisätilassa.", 80, 150, 4, 6),
            new TaskTemplate("Tapetointi", "Seinän tapetointi.", 70, 130, 3, 6),
            new TaskTemplate("Maalaa listat", "Jalkalistojen maalaus.", 40, 70, 2, 3)
    );

    private final List<TaskTemplate> snowRemovalTasks = Arrays.asList(
            new TaskTemplate("Kolaa lunta", "Pihan ja käytävien lumien kolaus.", 30, 60, 1, 3),
            new TaskTemplate("Lapiointi", "Lumen lapiointi pois kulkuteiltä.", 25, 50, 1, 2),
            new TaskTemplate("Hiekoita liukkaat", "Käytävien ja portaiden hiekoitus.", 20, 40, 1, 2),
            new TaskTemplate("Puhdista katto lumesta", "Katon lumen pudotus.", 60, 120, 2, 4),
            new TaskTemplate("Auraa piha", "Pihan auraus traktorilla.", 50, 100, 2, 3),
            new TaskTemplate("Poista jääpuikot", "Räystäiden jääpuikkojen poisto.", 40, 80, 2, 3)
    );

    private final List<TaskTemplate> otherTasks = Arrays.asList(
            new TaskTemplate("Ulkoiluta koira", "Koiran ulkoilutus tunnin ajan.", 15, 30, 1, 2),
            new TaskTemplate("Vie roskat", "Roskien ja kierrätyksen vienti ulos.", 10, 20, 1, 1),
            new TaskTemplate("Hoida lapsia", "Lastenhoitoapu kotona.", 50, 100, 2, 4),
            new TaskTemplate("Opastus tietotekniikassa", "Tietokoneen tai puhelimen käytön opastus.", 40, 80, 2, 3),
            new TaskTemplate("Ostosapua", "Avustus kauppaostoksilla.", 30, 50, 1, 2),
            new TaskTemplate("Vie kierrätys", "Kierrätettävien materiaalien vienti keräyspisteeseen.", 20, 40, 1, 2),
            new TaskTemplate("Kokoa polkupyörä", "Polkupyörän kokoaminen.", 30, 60, 1, 3),
            new TaskTemplate("Asennus- ja säätötyöt", "Erilaisten laitteiden asennus ja säätö.", 40, 80, 2, 4)
    );

    public TaskTestData(TaskRepository taskRepository, LocationTestData locationTestData) {
        this.taskRepository = taskRepository;
        this.locationTestData = locationTestData;
    }

    // Helper class for task templates
    private static class TaskTemplate {
        String title;
        String description;
        int minPayment;
        int maxPayment;
        int minHours;
        int maxHours;

        TaskTemplate(String title, String description, int minPayment, int maxPayment, int minHours, int maxHours) {
            this.title = title;
            this.description = description;
            this.minPayment = minPayment;
            this.maxPayment = maxPayment;
            this.minHours = minHours;
            this.maxHours = maxHours;
        }
    }

    public Map<String, Task> createTestTasks(Map<String, User> users, Map<String, Location> locations,
            Map<String, Category> categories) {

        User user1 = users.get("user1");
        User auth0 = users.get("auth0");

        // Get locations - now we have many real Finnish locations
        List<Location> locationList = new ArrayList<>(locations.values());
        Location firstLocation = locationList.get(0);  // Use first location for specific test cases
        Location secondLocation = locationList.size() > 1 ? locationList.get(1) : firstLocation;

        Category gardenCategory = categories.get("GARDEN");
        Category cleaningCategory = categories.get("CLEANING");
        Category movingCategory = categories.get("MOVING");

        Map<String, Task> tasks = new HashMap<>();

        // Keep a few hand-crafted tasks for specific test cases (auth0 user, multi-location, etc.)
        
        // ACTIVE task for auth0 user
        Task auth0ActiveTask = new Task(
                "Kitke rikkaruohot",
                30,
                LocalDateTime.now().plusDays(5),
                LocalDateTime.now().plusDays(5).plusHours(2),
                TaskStatus.ACTIVE,
                "Rikkaruohojen kitkeminen kasvimaalta.",
                auth0);
        auth0ActiveTask.getCategories().add(gardenCategory);
        auth0ActiveTask.getLocations().add(firstLocation);
        tasks.put("auth0ActiveTask", auth0ActiveTask);
        taskRepository.save(auth0ActiveTask);

        // Multi-location task
        Task multiLocationTask = new Task(
                "Kanna sohva",
                30,
                LocalDateTime.now().plusDays(1),
                LocalDateTime.now().plusDays(1).plusHours(1),
                TaskStatus.ACTIVE,
                "Sohvan kantaminen autoon.",
                user1);
        multiLocationTask.getCategories().add(movingCategory);
        multiLocationTask.getLocations().add(firstLocation);
        multiLocationTask.getLocations().add(secondLocation);
        tasks.put("multiLocationTask", multiLocationTask);
        taskRepository.save(multiLocationTask);

        // IN_PROGRESS task for testing
        Task inProgressTask = new Task(
                "Siivoa autotalli",
                100,
                LocalDateTime.now().plusDays(1),
                LocalDateTime.now().plusDays(1).plusHours(5),
                TaskStatus.IN_PROGRESS,
                "Iso autotalli vaatii siivousta.",
                user1);
        inProgressTask.getCategories().add(cleaningCategory);
        inProgressTask.getLocations().add(secondLocation);
        tasks.put("inProgressTask", inProgressTask);
        taskRepository.save(inProgressTask);

        return tasks;
    }

    /**
     * Generates additional bulk test tasks with realistic variety across all categories.
     * This method creates tasks using templates for each category with randomized:
     * - Task status distribution (majority ACTIVE for testing)
     * - Payment amounts within realistic ranges
     * - Start/end times spread across dates
     * - Locations and users
     * 
     * @param users Map of test users
     * @param locations Map of test locations
     * @param categories Map of test categories
     * @param count Number of additional tasks to generate
     * @return Map of generated tasks
     */
    public Map<String, Task> generateBulkTestTasks(
            Map<String, User> users,
            Map<String, Location> locations,
            Map<String, Category> categories,
            int count) {

        Map<String, Task> tasks = new HashMap<>();
        List<User> userList = new ArrayList<>(users.values());
        List<Location> locationList = new ArrayList<>(locations.values());

        // Get categories
        Category gardenCategory = categories.get("GARDEN");
        Category yardCategory = categories.get("YARD");
        Category forestWorkCategory = categories.get("FORESTWORK");
        Category householdCategory = categories.get("HOUSEHOLD");
        Category cleaningCategory = categories.get("CLEANING");
        Category movingCategory = categories.get("MOVING");
        Category repairCategory = categories.get("REPAIR");
        Category paintingCategory = categories.get("PAINTING");
        Category snowRemovalCategory = categories.get("SNOW_REMOVAL");
        Category otherCategory = categories.get("OTHER");

        // Create a list of all task templates with their categories
        List<TaskTemplateWithCategory> allTemplates = new ArrayList<>();
        gardenTasks.forEach(t -> allTemplates.add(new TaskTemplateWithCategory(t, gardenCategory)));
        yardTasks.forEach(t -> allTemplates.add(new TaskTemplateWithCategory(t, yardCategory)));
        forestWorkTasks.forEach(t -> allTemplates.add(new TaskTemplateWithCategory(t, forestWorkCategory)));
        householdTasks.forEach(t -> allTemplates.add(new TaskTemplateWithCategory(t, householdCategory)));
        cleaningTasks.forEach(t -> allTemplates.add(new TaskTemplateWithCategory(t, cleaningCategory)));
        movingTasks.forEach(t -> allTemplates.add(new TaskTemplateWithCategory(t, movingCategory)));
        repairTasks.forEach(t -> allTemplates.add(new TaskTemplateWithCategory(t, repairCategory)));
        paintingTasks.forEach(t -> allTemplates.add(new TaskTemplateWithCategory(t, paintingCategory)));
        snowRemovalTasks.forEach(t -> allTemplates.add(new TaskTemplateWithCategory(t, snowRemovalCategory)));
        otherTasks.forEach(t -> allTemplates.add(new TaskTemplateWithCategory(t, otherCategory)));

        // Status distribution weights (majority ACTIVE for testing)
        TaskStatus[] statuses = {
                TaskStatus.ACTIVE, TaskStatus.ACTIVE, TaskStatus.ACTIVE, TaskStatus.ACTIVE, TaskStatus.ACTIVE,
                TaskStatus.IN_PROGRESS, TaskStatus.IN_PROGRESS,
                TaskStatus.COMPLETED,
                TaskStatus.CANCELLED,
                TaskStatus.EXPIRED
        };

        for (int i = 0; i < count; i++) {
            // Pick random template
            TaskTemplateWithCategory templateWithCategory = allTemplates.get(random.nextInt(allTemplates.size()));
            TaskTemplate template = templateWithCategory.template;
            Category category = templateWithCategory.category;

            // Random user and weighted random location (60% Helsinki, 20% Espoo, 10% Vantaa, 10% other)
            User randomUser = userList.get(random.nextInt(userList.size()));
            Location randomLocation1 = locationTestData.getRandomLocation(locationList);
            
            // 20% chance of having a second location (for moving tasks, etc.)
            Location randomLocation2 = random.nextDouble() < 0.2 ? locationTestData.getRandomLocation(locationList) : null;

            // Random status
            TaskStatus status = statuses[random.nextInt(statuses.length)];

            // Calculate dates based on status
            LocalDateTime startTime;
            LocalDateTime endTime;
            int duration = template.minHours + random.nextInt(template.maxHours - template.minHours + 1);

            switch (status) {
                case ACTIVE:
                    // Future dates (1-30 days from now)
                    int daysAhead = 1 + random.nextInt(30);
                    startTime = LocalDateTime.now().plusDays(daysAhead);
                    endTime = startTime.plusHours(duration);
                    break;
                case IN_PROGRESS:
                    // Started today or recently
                    startTime = LocalDateTime.now().minusHours(random.nextInt(6));
                    endTime = startTime.plusHours(duration);
                    break;
                case COMPLETED:
                    // Past dates (1-60 days ago)
                    int daysAgo = 1 + random.nextInt(60);
                    startTime = LocalDateTime.now().minusDays(daysAgo);
                    endTime = startTime.plusHours(duration);
                    break;
                case CANCELLED:
                    // Mix of past and future
                    int daysDiff = random.nextInt(40) - 20; // -20 to +20 days
                    startTime = LocalDateTime.now().plusDays(daysDiff);
                    endTime = startTime.plusHours(duration);
                    break;
                case EXPIRED:
                    // Past dates that weren't completed
                    int expiredDaysAgo = 1 + random.nextInt(14);
                    startTime = LocalDateTime.now().minusDays(expiredDaysAgo);
                    endTime = startTime.plusHours(duration);
                    break;
                default:
                    startTime = LocalDateTime.now().plusDays(1);
                    endTime = startTime.plusHours(duration);
            }

            // Random payment within template range
            int payment = template.minPayment + random.nextInt(template.maxPayment - template.minPayment + 1);

            // Create task with a unique title (add counter if needed)
            String taskTitle = template.title;
            if (i > allTemplates.size()) {
                taskTitle = template.title + " #" + (i / allTemplates.size() + 1);
            }

            Task task = new Task(
                    taskTitle,
                    payment,
                    startTime,
                    endTime,
                    status,
                    template.description,
                    randomUser);

            task.getCategories().add(category);
            task.getLocations().add(randomLocation1);
            if (randomLocation2 != null && !randomLocation2.equals(randomLocation1)) {
                task.getLocations().add(randomLocation2);
            }

            String taskKey = "bulkTask" + i;
            tasks.put(taskKey, task);
            taskRepository.save(task);
        }

        return tasks;
    }

    // Helper class to pair template with category
    private static class TaskTemplateWithCategory {
        TaskTemplate template;
        Category category;

        TaskTemplateWithCategory(TaskTemplate template, Category category) {
            this.template = template;
            this.category = category;
        }
    }

    public void cleanUp() {
        taskRepository.deleteAll();
    }
}
