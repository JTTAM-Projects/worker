package com.jttam.glig.domain.task;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.jttam.glig.domain.user.User;
import com.jttam.glig.domain.user.UserRepository;
import com.jttam.glig.exception.custom.ForbiddenException;
import com.jttam.glig.exception.custom.NotFoundException;
import com.jttam.glig.service.Message;

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

    public Task findTaskByGivenUserNameAndTaskId(String username, Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new NotFoundException("TASK_NOT_FOUND", "Cannot find task by given id"));
        if (!task.getUser().getUserName().equals(username)) {
            throw new ForbiddenException("FORBIDDEN", "JWT in sent request has no access for this task");
        }
        return task;
    }

    public TaskDto tryGetSingleTaskDtoById(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new NotFoundException("TASK_NOT_FOUND", "Cannot find task by given id"));
        return mapper.toTaskDto(task);
    }

    public List<TaskDto> tryGetAllUserTasks(String username) {
        List<Task> tasks = taskRepository.findAllByUser_UserName(username);
        return mapper.toTaskDTOList(tasks);
    }

    public ResponseEntity<TaskDto> tryCreateNewTask(TaskDto taskDto, String username) {
        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new NotFoundException("USER_NOT_FOUND", "User not found"));
        Task task = mapper.toTaskEntity(taskDto);
        task.setUser(user);
        return new ResponseEntity<>(taskDto, HttpStatus.CREATED);
    }

    public ResponseEntity<TaskDto> tryEditTask(Long taskId, TaskDto taskDto, String username) {
        Task task = findTaskByGivenUserNameAndTaskId(username, taskId);
        Task updatedTask = mapper.updateTask(taskDto, task);
        taskRepository.save(updatedTask);
        return new ResponseEntity<>(taskDto, HttpStatus.OK);
    }

    public ResponseEntity<Message> tryDeleteTask(Long taskId, String username) {
        if (!taskRepository.existsById(taskId)) {
            throw new NotFoundException("TASK_NOT_FOUND", "Cannot find task by given task id");
        }
        taskRepository.deleteById(taskId);
        return new ResponseEntity<>(new Message("SUCCESS", "Task deleted successfully"), HttpStatus.OK);
    }
}
