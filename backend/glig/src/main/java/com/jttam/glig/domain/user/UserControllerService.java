package com.jttam.glig.domain.user;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.jttam.glig.exception.custom.NotFoundException;
import com.jttam.glig.service.Message;

@Service
public class UserControllerService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserControllerService(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    public User findUserByGivenJWT(String username) {
        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new NotFoundException("USER_NOT_FOUND", "Cannot find user by given jwt"));
        return user;
    }

    public UserDto tryGetSingleUserDtoByUserName(String username) {
        User user = findUserByGivenJWT(username);
        UserDto userDto = userMapper.toUserDTO(user);
        return userDto;
    }

    public ResponseEntity<?> tryCreateNewUser(UserDto userDto, String username) {
        Optional<User> user = userRepository.findByUserName(username);
        if (user.isPresent()) {
            return new ResponseEntity<>(new Message("ERROR", "User already exists"), HttpStatus.CONFLICT);
        }
        User newUser = userMapper.toUser(userDto);
        newUser.setUserName(username);
        userRepository.save(newUser);
        return new ResponseEntity<>(userDto, HttpStatus.CREATED);
    }

    public ResponseEntity<UserDto> tryEditUser(UserDto userDto, String username) {
        User user = findUserByGivenJWT(username);
        User updatedUser = userMapper.updateUser(userDto, user);
        userRepository.save(updatedUser);
        return new ResponseEntity<>(userDto, HttpStatus.OK);
    }

    public ResponseEntity<UserDto> tryDeleteUser(String username) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'tryDeleteUser'");
    }

}