package com.jttam.glig.domain.user;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.jttam.glig.service.Message;

import jakarta.validation.Valid;

@RestController
@RequestMapping("user/")
public class UserController {

    private final UserControllerService service;

    public UserController(UserControllerService service) {
        this.service = service;
    }

    @GetMapping("{user-name}")
    public UserDto getSingleUser(@PathVariable String userName) {
        return service.tryGetSingleUserDtoById(userName);
    }

    @PostMapping("{create")
    public ResponseEntity<Message> createUser(@Valid @RequestBody UserDto userDto,
            BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    bindingResult.getAllErrors().get(0).getDefaultMessage());
        }

        return service.tryCreateNewUser(userDto);
    }

    @PutMapping("edit")
    public ResponseEntity<Message> editUser(@Valid @RequestBody UserDto userDto,
            BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    bindingResult.getAllErrors().get(0).getDefaultMessage());
        }

        return service.tryEditUser(userDto);
    }

}
