package com.jttam.glig.domain.task;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import com.jttam.glig.domain.apply.ApplyMapper;
import com.jttam.glig.domain.user.UserMapper;

@Mapper(componentModel = "spring", uses = { UserMapper.class, ApplyMapper.class })
public interface TaskMapper {

    TaskDto toTaskDto(Task task);

    TaskListDTO toTaskList(Task task);

    @Mapping(target = "applies", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Task toTaskEntity(TaskDto taskDto);

    @Mapping(target = "applies", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Task updateTask(TaskDto taskDto, @MappingTarget Task task);

    List<TaskListDTO> toTaskDtoList(List<Task> tasks);

    default Page<TaskListDTO> toTaskListDtoPage(Page<Task> page) {
        List<TaskListDTO> dtoList = toTaskDtoList(page.getContent());
        return new PageImpl<>(dtoList, page.getPageable(), page.getTotalElements());
    }

}
