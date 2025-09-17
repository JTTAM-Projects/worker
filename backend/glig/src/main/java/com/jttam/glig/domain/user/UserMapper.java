package com.jttam.glig.domain.user;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDto toUserDTO(User user);

    @Mapping(target = "tasks", ignore = true)
    @Mapping(target = "applies", ignore = true)
    User toUser(UserDto userDto);

    @Mapping(target = "tasks", ignore = true)
    @Mapping(target = "applies", ignore = true)
    User updateUser(UserDto userDto, @MappingTarget User user);
}
