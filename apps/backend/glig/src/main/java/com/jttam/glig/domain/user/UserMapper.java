package com.jttam.glig.domain.user;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.jttam.glig.domain.user.dto.UserRequest;
import com.jttam.glig.domain.user.dto.UserResponse;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserResponse toUserResponse(User user);

    @Mapping(target = "userName", ignore = true)
    @Mapping(target = "tasks", ignore = true)
    @Mapping(target = "applies", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    User toUserEntity(UserRequest userRequest);

    @Mapping(target = "userName", ignore = true)
    @Mapping(target = "tasks", ignore = true)
    @Mapping(target = "applies", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    User updateUser(UserRequest userRequest, @MappingTarget User user);
}
