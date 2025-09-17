package com.jttam.glig.domain.task;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

import com.jttam.glig.domain.user.User;
import com.jttam.glig.domain.user.UserRepository;
import com.jttam.glig.exception.custom.ForbiddenException;
import com.jttam.glig.exception.custom.NotFoundException;
import com.jttam.glig.service.GlobalServiceMethods;
import com.jttam.glig.service.Message;

@Service
public class TaskControllerService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskMapper mapper;

    @Autowired
    private GlobalServiceMethods serviceMethods;

    public Task findTaskByGivenUserNameAndTaskId(String userName, Long taskId) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new NotFoundException("TASK_NOT_FOUND", "Cannot find task by given id"));

        if (!task.getUser().getUserName().equals(userName)) {
            throw new ForbiddenException("FORBIDDEN", "JWT in sent request has no access for this task");
        }
        return task;
    }

    public TaskDto tryGetSingleTaskDtoById(Long taskId) {
        String userName = serviceMethods.getUsernameFromJwt();
        Task task = findTaskByGivenUserNameAndTaskId(userName, taskId);
        return mapper.toTaskDto(task);
    }

    public List<TaskDto> tryGetAllUserTasks() {
        String userName = serviceMethods.getUsernameFromJwt();
        List<Task> tasks = taskRepository.findAllByUser_UserName(userName);
        return mapper.toTaskDTOList(tasks);
    }

    public ResponseEntity<Message> tryCreateNewTask(TaskDto taskDto) {
        String userName = serviceMethods.getUsernameFromJwt();
        User user = userRepository.findByUserName(userName)
                .orElseThrow(() -> new NotFoundException("USER_NOT_FOUND", "User not found"));
        Task task = mapper.toTaskEntity(taskDto);
        task.setUser(user);
        taskRepository.save(task);
        return ResponseEntity.ok(new Message("SUCCESS", "Task created"));
    }

    public ResponseEntity<Message> tryEditTask(Long taskId, TaskDto taskDto) {
        String userName = serviceMethods.getUsernameFromJwt();
        Task task = findTaskByGivenUserNameAndTaskId(userName, taskId);
        Task updatedTask = mapper.updateTask(taskDto, task);
        taskRepository.save(updatedTask);
        return ResponseEntity.status(HttpStatus.CREATED).body(new Message("SUCCESS", "Task created"));
    }
}
