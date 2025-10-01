package com.jttam.glig.domain.apply;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.jttam.glig.domain.task.Task;
import com.jttam.glig.domain.task.TaskRepository;
import com.jttam.glig.domain.user.User;
import com.jttam.glig.domain.user.UserRepository;
import com.jttam.glig.exception.custom.NotFoundException;
import com.jttam.glig.service.Message;
import com.jttam.glig.service.Specifications;

@Service
public class ApplyControllerService {

    private final ApplyRepository applyRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ApplyMapper mapper;

    public ApplyControllerService(ApplyRepository applyRepository, TaskRepository taskRepository,
            UserRepository userRepository, ApplyMapper mapper) {
        this.applyRepository = applyRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.mapper = mapper;
    }

    public ApplyDto tryGetSingleApplyDtoById(Long taskId, String username) {
        ApplyId applyId = new ApplyId(taskId, username);
        Apply apply = applyRepository.findById(applyId)
                .orElseThrow(() -> new NotFoundException("APPLY_NOT_FOUND",
                        "Cannot find apply with given details " + applyId.toString()));
        ApplyDto applyDto = mapper.toApplyDTO(apply);
        return applyDto;
    }

    public Page<ApplyListDTO> tryGetAllUserApplies(Pageable pageable, ApplyDataGridFilters filters,
            String username) {
        Specification<Apply> spec = Specifications.withApplyFilters(filters, username);
        Page<Apply> applies = applyRepository.findAll(spec, pageable);
        Page<ApplyListDTO> listOfApplyDto = mapper.toApplyDtoListPage(applies);
        return listOfApplyDto;
    }

    public ResponseEntity<?> tryCreateNewApplyForTask(Long taskId, ApplyDto applyDto, String username) {
        ApplyId applyId = new ApplyId(taskId, username);
        Optional<Apply> apply = applyRepository.findById(applyId);
        if (apply.isPresent()) {
            return new ResponseEntity<Message>(new Message("ERROR", "User has already apply for this task"),
                    HttpStatus.CONFLICT);
        }

        Task task = taskRepository.getReferenceById(taskId);
        User user = userRepository.getReferenceById(username);

        if (user != null) {
            if (task != null) {
                Apply newApply = mapper.toApplyEntity(applyDto);
                newApply.setUser(user);
                newApply.setTask(task);
                applyRepository.save(newApply);
                return new ResponseEntity<>(applyDto, HttpStatus.CREATED);
            }
            throw new NotFoundException("TASK_NOT_FOUND", "Cannot find task by given taskId");
        }
        throw new NotFoundException("USER_NOT_FOUND", "Cannot find user for given username in jwt");
    }

    public ResponseEntity<ApplyDto> tryEditApply(Long taskId, ApplyDto applyDto, String username) {
        ApplyId applyId = new ApplyId(taskId, username);
        Apply apply = applyRepository.findById(applyId)
                .orElseThrow(() -> new NotFoundException("APPLY_NOT_FOUND", "Cannot find apply with given details"));
        Apply updatedApply = mapper.updateApply(applyDto, apply);
        applyRepository.save(updatedApply);
        return new ResponseEntity<>(applyDto, HttpStatus.OK);
    }

    public ResponseEntity<Message> tryDeleteApply(Long taskId, String username) {
        ApplyId applyId = new ApplyId(taskId, username);
        if (!applyRepository.existsById(applyId)) {
            throw new NotFoundException("APPLY_NOT_FOUND", "Cannot find apply with given details to delete");
        }
        applyRepository.deleteById(applyId);
        return new ResponseEntity<>(new Message("SUCCESS", "Apply deleted successfully"), HttpStatus.OK);
    }
}
