package com.jttam.glig.domain.apply;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.jttam.glig.service.Message;

@Service
public class ApplyControllerService {
    private final ApplyRepository repository;

    public ApplyControllerService(ApplyRepository repository) {
        this.repository = repository;
    }

    public ApplyDto tryGetSingleApplyDtoById(Long taskId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'tryGetSingleApplyDtoById'");
    }

    public ApplyListDTO tryGetAllUserApplies() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'tryGetAllUserApplies'");
    }

    public ResponseEntity<Message> tryCreateNewApply(Long taskId, ApplyDto applyDto) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'tryCreateNewApply'");
    }

    public ResponseEntity<Message> tryEditApply(Long taskId, ApplyDto applyDto) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'tryEditApply'");
    }

}
