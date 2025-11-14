package com.jttam.glig.domain.user;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.jttam.glig.domain.user.dto.UserRequest;
import com.jttam.glig.domain.user.dto.UserResponse;
import com.jttam.glig.exception.custom.NotFoundException;
import com.jttam.glig.service.Message;

import jakarta.transaction.Transactional;

@Service
public class UserControllerService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserControllerService(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    public User findUserByGivenUserName(String username) {
        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new NotFoundException("USER_NOT_FOUND", "Cannot find user by given jwt"));
        return user;
    }

    @Transactional
    public UserResponse tryGetSingleUserDtoByUserName(String username) {
        User user = findUserByGivenUserName(username);
        UserResponse userDto = userMapper.toUserResponse(user);
        return userDto;
    }

    @Transactional
    public ResponseEntity<?> tryCreateNewUser(UserRequest userBody, String username) {
        Optional<User> user = userRepository.findByUserName(username);
        if (user.isPresent()) {
            return new ResponseEntity<>(new Message("ERROR", "User already exists"), HttpStatus.CONFLICT);
        }
        User newUser = userMapper.toUserEntity(userBody);
        newUser.setUserName(username);
        User created = userRepository.save(newUser);
        UserResponse out = userMapper.toUserResponse(created);
        return new ResponseEntity<>(out, HttpStatus.CREATED);
    }

    @Transactional
    public ResponseEntity<UserResponse> tryEditUser(UserRequest userBody, String username) {
        User user = findUserByGivenUserName(username);
        User updatedUser = userMapper.updateUser(userBody, user);
        User created = userRepository.save(updatedUser);
        UserResponse out = userMapper.toUserResponse(created);

        return new ResponseEntity<>(out, HttpStatus.OK);
    }

    @Transactional
    public ResponseEntity<UserResponse> tryDeleteUser(String username) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'tryDeleteUser'");
    }
}