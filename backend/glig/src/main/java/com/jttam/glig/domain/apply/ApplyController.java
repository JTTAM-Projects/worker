package com.jttam.glig.domain.apply;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.jttam.glig.service.Message;

import jakarta.validation.Valid;

@RestController
@RequestMapping("apply/")
public class ApplyController {

    private final ApplyControllerService service;

    public ApplyController(ApplyControllerService service) {
        this.service = service;
    }

    @GetMapping("{taskId}")
    public ApplyDto getSingleApplyDto(@PathVariable Long taskId) {
        return service.tryGetSingleApplyDtoById(taskId);
    }

    @GetMapping("user-applies")
    public ApplyListDTO getAllUserApplies() {
        return service.tryGetAllUserApplies();
    }

    @PostMapping("{taskId}/create")
    public ResponseEntity<Message> createApplyForTask(Long taskId, @Valid @RequestBody ApplyDto applyDto,
            BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    bindingResult.getAllErrors().get(0).getDefaultMessage());
        }

        return service.tryCreateNewApply(taskId, applyDto);
    }

    @PutMapping("{taskId}/edit")
    public ResponseEntity<Message> editApply(Long taskId, @Valid @RequestBody ApplyDto applyDto,
            BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    bindingResult.getAllErrors().get(0).getDefaultMessage());
        }

        return service.tryEditApply(taskId, applyDto);
    }

}
