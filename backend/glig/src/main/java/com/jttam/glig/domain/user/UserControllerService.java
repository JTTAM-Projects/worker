package com.jttam.glig.domain.user;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.jttam.glig.service.Message;

@Service
public class UserControllerService {
    private UserRepository userRepository;

    public UserDto tryGetSingleUserDtoById(Long userId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'tryGetSingleUserDtoById'");
    }

    public UserListDTO tryGetAllUserUsers() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'tryGetAllUserUsers'");
    }

    public ResponseEntity<Message> tryCreateNewUser(Long userId, UserDto userDto) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'tryCreateNewUser'");
    }

    public ResponseEntity<Message> tryEditUser(Long userId, UserDto userDto) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'tryEditUser'");
    }

}
