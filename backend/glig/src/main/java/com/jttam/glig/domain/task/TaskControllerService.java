package com.jttam.glig.domain.task;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.jttam.glig.domain.task.dto.TaskResponse;
import com.jttam.glig.domain.category.Category;
import com.jttam.glig.domain.category.CategoryRepository;
import com.jttam.glig.domain.task.dto.TaskListDTO;
import com.jttam.glig.domain.task.dto.TaskRequest;
import com.jttam.glig.domain.user.User;
import com.jttam.glig.domain.user.UserRepository;
import com.jttam.glig.exception.custom.ForbiddenException;
import com.jttam.glig.exception.custom.NotFoundException;
import com.jttam.glig.service.Message;

import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;

@Service
public class TaskControllerService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final TaskMapper mapper;

    public TaskControllerService(TaskRepository taskRepository, UserRepository userRepository,
            CategoryRepository categoryRepository, TaskMapper mapper) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.mapper = mapper;
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
        Task saved = taskRepository.save(task);
        TaskResponse out = mapper.toTaskResponse(saved);
        return new ResponseEntity<>(out, HttpStatus.CREATED);
    }

    @Transactional
    public ResponseEntity<TaskResponse> tryEditTask(Long taskId, TaskRequest taskRequest, String username) {
        Task task = findTaskByGivenUserNameAndTaskId(username, taskId);
        Task updatedTask = mapper.updateTask(taskRequest, task);
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

                if (filters.categoryTitle() != null && !filters.categoryTitle().isBlank()) {
                    Category category = categoryRepository.findByTitle(filters.categoryTitle());

                    if (category != null) {
                        predicates.add(criteriabuilder.isMember(category, root.get("categories")));
                    }

                    else {
                        predicates.add(criteriabuilder.disjunction());
                    }
                }

                if (filters.status() != null) {
                    predicates.add(criteriabuilder.equal(root.get("status"), filters.status()));
                }
            }
            return criteriabuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
