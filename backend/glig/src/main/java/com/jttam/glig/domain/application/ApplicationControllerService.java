package com.jttam.glig.domain.application;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.jttam.glig.domain.application.dto.ApplicationResponse;
import com.jttam.glig.domain.application.dto.ApplicationListDTO;
import com.jttam.glig.domain.application.dto.ApplicationRequest;
import com.jttam.glig.domain.task.Task;
import com.jttam.glig.domain.task.TaskRepository;
import com.jttam.glig.domain.user.User;
import com.jttam.glig.domain.user.UserRepository;
import com.jttam.glig.exception.custom.NotFoundException;
import com.jttam.glig.service.Message;
import com.jttam.glig.service.Specifications;

import jakarta.transaction.Transactional;

@Service
public class ApplicationControllerService {

    private final ApplicationRepository applyRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ApplicationMapper mapper;

    public ApplicationControllerService(ApplicationRepository applyRepository, TaskRepository taskRepository,
            UserRepository userRepository, ApplicationMapper mapper) {
        this.applyRepository = applyRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.mapper = mapper;
    }

    @Transactional
    public ApplicationResponse tryGetSingleApplicationsById(Long taskId, String username) {
        ApplicationId applyId = new ApplicationId(taskId, username);
        Application apply = applyRepository.findById(applyId)
                .orElseThrow(() -> new NotFoundException("APPLY_NOT_FOUND",
                        "Cannot find apply with given details " + applyId.toString()));
        ApplicationResponse applyDto = mapper.toApplicationResponse(apply);
        return applyDto;
    }

    @Transactional
    public Page<ApplicationListDTO> tryGetAllUserApplications(Pageable pageable, ApplicationDataGridFilters filters,
            String username) {
        Specification<Application> spec = Specifications.withApplicationFilters(filters, username);
        Page<Application> applies = applyRepository.findAll(spec, pageable);
        Page<ApplicationListDTO> listOfApplyDto = mapper.toApplicationResponseListPage(applies);
        return listOfApplyDto;
    }

    @Transactional
    public ResponseEntity<?> tryCreateNewApplicationForTask(Long taskId, ApplicationRequest application,
            String username) {
        ApplicationId applyId = new ApplicationId(taskId, username);
        Optional<Application> apply = applyRepository.findById(applyId);
        if (apply.isPresent()) {
            return new ResponseEntity<Message>(new Message("ERROR", "User has already apply for this task"),
                    HttpStatus.CONFLICT);
        }

        Task task = taskRepository.getReferenceById(taskId);
        User user = userRepository.getReferenceById(username);

        Application newApply = mapper.toApplicationEntity(application);
        newApply.setUser(user);
        newApply.setTask(task);
        Application saved = applyRepository.save(newApply);
        ApplicationResponse response = mapper.toApplicationResponse(saved);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Transactional
    public ResponseEntity<ApplicationResponse> tryEditApplication(Long taskId, ApplicationRequest request,
            String username) {
        ApplicationId applyId = new ApplicationId(taskId, username);
        Application apply = applyRepository.findById(applyId)
                .orElseThrow(() -> new NotFoundException("APPLY_NOT_FOUND", "Cannot find apply with given details"));
        Application updatedApply = mapper.updateApplication(request, apply);
        Application saved = applyRepository.save(updatedApply);
        ApplicationResponse response = mapper.toApplicationResponse(saved);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Transactional
    public ResponseEntity<Message> tryDeleteApplication(Long taskId, String username) {
        ApplicationId applyId = new ApplicationId(taskId, username);
        if (!applyRepository.existsById(applyId)) {
            throw new NotFoundException("APPLY_NOT_FOUND", "Cannot find apply with given details to delete");
        }
        applyRepository.deleteById(applyId);
        return new ResponseEntity<>(new Message("SUCCESS", "Apply deleted successfully"), HttpStatus.OK);
    }
}
