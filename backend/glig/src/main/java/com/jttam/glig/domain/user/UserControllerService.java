package com.jttam.glig.domain.user;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.jttam.glig.service.Message;

@Service
public class UserControllerService {
    private UserRepository userRepository;

    public UserDto tryGetSingleUserDtoById(String userName) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'tryGetSingleUserDtoById'");
    }

    public ResponseEntity<Message> tryCreateNewUser(UserDto userDto) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'tryCreateNewUser'");
    }

    public ResponseEntity<Message> tryEditUser(UserDto userDto) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'tryEditUser'");
    }

}
