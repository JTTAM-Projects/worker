package com.jttam.glig.domain.task;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.jttam.glig.domain.apply.ApplyMapper;
import com.jttam.glig.domain.user.UserMapper;

@Mapper(componentModel = "spring", uses = { UserMapper.class, ApplyMapper.class })
public interface TaskMapper {

    TaskDto toTaskDto(Task task);

    @Mapping(target = "applies", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Task toTaskEntity(TaskDto taskDto);

    @Mapping(target = "applies", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Task updateTask(TaskDto taskDto, @MappingTarget Task task);

    List<TaskDto> toTaskDTOList(List<Task> tasks);

}
