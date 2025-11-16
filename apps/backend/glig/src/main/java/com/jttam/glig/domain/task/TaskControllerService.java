package com.jttam.glig.domain.task;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.jttam.glig.domain.task.dto.TaskResponse;
import com.jttam.glig.domain.category.Category;
import com.jttam.glig.domain.category.CategoryRepository;
import com.jttam.glig.domain.category.dto.CategoryRequest;
import com.jttam.glig.domain.location.Location;
import com.jttam.glig.domain.location.LocationRepository;
import com.jttam.glig.domain.location.dto.LocationRequest;
import com.jttam.glig.domain.task.dto.TaskListDTO;
import com.jttam.glig.domain.task.dto.TaskRequest;
import com.jttam.glig.domain.user.User;
import com.jttam.glig.domain.user.UserRepository;
import com.jttam.glig.exception.custom.ForbiddenException;
import com.jttam.glig.exception.custom.NotFoundException;
import com.jttam.glig.service.Message;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import java.util.stream.Collectors;

@Service
public class TaskControllerService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final LocationRepository locationRepository;
    private final TaskMapper mapper;

    public TaskControllerService(TaskRepository taskRepository, UserRepository userRepository,
            CategoryRepository categoryRepository, LocationRepository locationRepository, TaskMapper mapper) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.locationRepository = locationRepository;
        this.mapper = mapper;
    }

    private Set<Category> resolveCategories(Set<CategoryRequest> categoryRequests) {
        if (categoryRequests == null || categoryRequests.isEmpty()) {
            return new HashSet<>();
        }

        return categoryRequests.stream()
                .map(this::resolveCategory)
                .filter(Objects::nonNull)
                .collect(Collectors.toCollection(HashSet::new));
    }

    private Category resolveCategory(CategoryRequest categoryRequest) {
        if (categoryRequest == null) {
            return null;
        }

        String title = categoryRequest.title();
        if (title == null || title.isBlank()) {
            return null;
        }

        String normalizedTitle = title.trim();
        Category existing = categoryRepository.findByTitle(normalizedTitle);
        if (existing != null) {
            return existing;
        }

        Category category = new Category();
        category.setTitle(normalizedTitle);
        return categoryRepository.save(category);
    }

    private Set<Location> resolveLocations(Set<LocationRequest> locationRequests) {
        if (locationRequests == null || locationRequests.isEmpty()) {
            return new HashSet<>();
        }

        return locationRequests.stream()
                .map(this::resolveLocation)
                .filter(Objects::nonNull)
                .collect(Collectors.toCollection(HashSet::new));
    }

    private Location resolveLocation(LocationRequest request) {
        if (request == null) {
            return null;
        }

        Location location = new Location();
        location.setStreetAddress(request.streetAddress());
        location.setPostalCode(request.postalCode());
        location.setCity(request.city());
        location.setCountry(request.country());
        location.setLatitude(request.latitude());
        location.setLongitude(request.longitude());

        return locationRepository.save(location);
    }

    @Transactional
    public Task findTaskByGivenUserNameAndTaskId(String username, Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new NotFoundException("TASK_NOT_FOUND", "Cannot find task by given id"));
        if (!task.getUser().getUserName().equals(username)) {
            throw new ForbiddenException("FORBIDDEN", "JWT in sent request has no access for this task");
        }
        return task;
    }

    @Transactional
    public TaskResponse tryGetSingleTaskDtoById(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new NotFoundException("TASK_NOT_FOUND", "Cannot find task by given id"));
        return mapper.toTaskResponse(task);
    }

    @Transactional
    public ResponseEntity<TaskResponse> tryCreateNewTask(TaskRequest taskRequest, String username) {
        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new NotFoundException("USER_NOT_FOUND", "User not found"));

        Task task = mapper.toTaskEntity(taskRequest);
        task.setUser(user);
        task.setStatus(TaskStatus.ACTIVE);

        task.setCategories(resolveCategories(taskRequest.categories()));
        task.setLocations(resolveLocations(taskRequest.locations()));

        Task saved = taskRepository.save(task);
        TaskResponse out = mapper.toTaskResponse(saved);
        return new ResponseEntity<>(out, HttpStatus.CREATED);
    }

    @Transactional
    public ResponseEntity<TaskResponse> tryEditTask(Long taskId, TaskRequest taskRequest, String username) {
        Task task = findTaskByGivenUserNameAndTaskId(username, taskId);
        Task updatedTask = mapper.updateTask(taskRequest, task);

        updatedTask.setCategories(resolveCategories(taskRequest.categories()));
        updatedTask.setLocations(resolveLocations(taskRequest.locations()));

        Task saved = taskRepository.save(updatedTask);
        TaskResponse out = mapper.toTaskResponse(saved);
        return new ResponseEntity<>(out, HttpStatus.OK);
    }

    @Transactional
    public ResponseEntity<Message> tryDeleteTask(Long taskId, String username) {
        Task task = findTaskByGivenUserNameAndTaskId(username, taskId);
        taskRepository.deleteById(task.getId());
        return new ResponseEntity<>(new Message("SUCCESS", "Task deleted successfully"), HttpStatus.OK);
    }

    @Transactional
    public Page<TaskListDTO> tryGetAllTaskByGivenFiltersAndSortsAndUserName(Pageable pageable,
            TaskDataGridFilters filters,
            String username) {
        Specification<Task> spec = withTaskFilters(filters, username);
        Page<Task> tasks = taskRepository.findAll(spec, pageable);
        Page<TaskListDTO> pageOfTasks = mapper.toTaskListDtoPage(tasks);
        return pageOfTasks;
    }

    public Specification<Task> withTaskFilters(TaskDataGridFilters filters, String username) {

        return (root, query, criteriabuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (username != null) {
                predicates.add(criteriabuilder.equal(root.get("user").get("userName"), username));
            }

            if (filters != null) {

                // Text search across title and description
                if (filters.searchText() != null && !filters.searchText().isBlank()) {
                    String searchPattern = "%" + filters.searchText().toLowerCase() + "%";
                    Predicate titleMatch = criteriabuilder.like(
                            criteriabuilder.lower(root.get("title")),
                            searchPattern);
                    Predicate descriptionMatch = criteriabuilder.like(
                            criteriabuilder.lower(root.get("description")),
                            searchPattern);
                    predicates.add(criteriabuilder.or(titleMatch, descriptionMatch));
                }

                // Multiple category filtering (OR logic)
                if (filters.categories() != null && !filters.categories().isEmpty()) {
                    List<Category> categories = filters.categories().stream()
                            .map(categoryRepository::findByTitle)
                            .filter(category -> category != null)
                            .collect(Collectors.toList());

                    if (!categories.isEmpty()) {
                        List<Predicate> categoryPredicates = categories.stream()
                                .map(category -> criteriabuilder.isMember(category, root.get("categories")))
                                .collect(Collectors.toList());
                        predicates.add(criteriabuilder.or(categoryPredicates.toArray(new Predicate[0])));
                    } else {
                        // If categories specified but none found, return no results
                        predicates.add(criteriabuilder.disjunction());
                    }
                }

                // Price range filtering
                if (filters.minPrice() != null) {
                    predicates.add(criteriabuilder.greaterThanOrEqualTo(root.get("price"), filters.minPrice()));
                }
                if (filters.maxPrice() != null) {
                    predicates.add(criteriabuilder.lessThanOrEqualTo(root.get("price"), filters.maxPrice()));
                }

                // Location proximity filtering
                if (filters.latitude() != null && filters.longitude() != null && filters.radiusKm() != null) {
                    // Using simplified bounding box approach (works with H2)
                    // Approximate: 1 degree latitude ≈ 111 km
                    // 1 degree longitude ≈ 111 km * cos(latitude)

                    double lat = filters.latitude();
                    double lon = filters.longitude();
                    double radiusKm = filters.radiusKm();

                    // Calculate approximate bounding box
                    double latDelta = radiusKm / 111.0; // degrees latitude per km
                    double lonDelta = radiusKm / (111.0 * Math.cos(Math.toRadians(lat))); // degrees longitude per km

                    double minLat = lat - latDelta;
                    double maxLat = lat + latDelta;
                    double minLon = lon - lonDelta;
                    double maxLon = lon + lonDelta;

                    // Join the locations relationship and create bounding box filter
                    Join<Object, Object> locationJoin = root.join("locations");
                    Predicate latInRange = criteriabuilder.between(
                            locationJoin.get("latitude"),
                            minLat,
                            maxLat);
                    Predicate lonInRange = criteriabuilder.between(
                            locationJoin.get("longitude"),
                            minLon,
                            maxLon);

                    predicates.add(criteriabuilder.and(latInRange, lonInRange));
                }

                // Task status filtering
                if (filters.status() != null) {
                    predicates.add(criteriabuilder.equal(root.get("status"), filters.status()));
                }
            }
            return criteriabuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
