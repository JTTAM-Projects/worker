package com.jttam.glig.domain.task;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.jttam.glig.domain.user.User;
import com.jttam.glig.domain.user.UserRepository;
import com.jttam.glig.exception.custom.ForbiddenException;
import com.jttam.glig.exception.custom.NotFoundException;
import com.jttam.glig.service.Message;
import com.jttam.glig.service.Specifications;

import jakarta.transaction.Transactional;

@Service
public class TaskControllerService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TaskMapper mapper;

    public TaskControllerService(TaskRepository taskRepository, UserRepository userRepository, TaskMapper mapper) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
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
    public TaskDto tryGetSingleTaskDtoById(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new NotFoundException("TASK_NOT_FOUND", "Cannot find task by given id"));
        return mapper.toTaskDto(task);
    }

    @Transactional
    public List<TaskListDTO> tryGetAllUserTasks(String username) {
        List<Task> tasks = taskRepository.findAllByUser_UserName(username);
        return mapper.toTaskDtoList(tasks);
    }

    @Transactional
    public ResponseEntity<TaskDto> tryCreateNewTask(TaskDto taskDto, String username) {
        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new NotFoundException("USER_NOT_FOUND", "User not found"));

        Task task = mapper.toTaskEntity(taskDto);
        task.setUser(user);

        if (task.getStatus() == null) {
            task.setStatus(TaskStatus.ACTIVE);
        }

        Task saved = taskRepository.save(task);
        TaskDto out = mapper.toTaskDto(saved);
        return new ResponseEntity<>(out, HttpStatus.CREATED);
    }

    @Transactional
    public ResponseEntity<TaskDto> tryEditTask(Long taskId, TaskDto taskDto, String username) {
        Task task = findTaskByGivenUserNameAndTaskId(username, taskId);
        Task updatedTask = mapper.updateTask(taskDto, task);
        taskRepository.save(updatedTask);
        return new ResponseEntity<>(taskDto, HttpStatus.OK);
    }

    @Transactional
    public ResponseEntity<Message> tryDeleteTask(Long taskId, String username) {
        if (!taskRepository.existsById(taskId)) {
            throw new NotFoundException("TASK_NOT_FOUND", "Cannot find task by given task id");
        }
        taskRepository.deleteById(taskId);
        return new ResponseEntity<>(new Message("SUCCESS", "Task deleted successfully"), HttpStatus.OK);
    }

    @Transactional
    public Page<TaskListDTO> tryGetAllTaskByGivenFiltersAndSorts(Pageable pageable, TaskDataGridFilters filters) {
        Specification<Task> spec = Specifications.withTaskFilters(filters);
        Page<Task> tasks = taskRepository.findAll(spec, pageable);
        Page<TaskListDTO> pageOfTasks = mapper.toTaskListDtoPage(tasks);
        return pageOfTasks;
    }
}
