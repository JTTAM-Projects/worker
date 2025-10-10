package com.jttam.glig.domain.task;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import com.jttam.glig.domain.application.ApplicationMapper;
import com.jttam.glig.domain.location.LocationMapper;
import com.jttam.glig.domain.task.dto.TaskResponse;
import com.jttam.glig.domain.task.dto.TaskListDTO;
import com.jttam.glig.domain.task.dto.TaskRequest;
import com.jttam.glig.domain.user.UserMapper;

@Mapper(componentModel = "spring", uses = { UserMapper.class, ApplicationMapper.class, LocationMapper.class })
public interface TaskMapper {

    TaskResponse toTaskResponse(Task task);

    TaskListDTO toTaskList(Task task);

    @Mapping(target = "applies", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "user", ignore = true)
    Task toTaskEntity(TaskRequest taskRequest);

    @Mapping(target = "applies", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "user", ignore = true)
    Task updateTask(TaskRequest taskRequestBody, @MappingTarget Task task);

    List<TaskListDTO> toTaskResponseList(List<Task> tasks);

    default Page<TaskListDTO> toTaskListDtoPage(Page<Task> page) {
        List<TaskListDTO> dtoList = toTaskResponseList(page.getContent());
        return new PageImpl<>(dtoList, page.getPageable(), page.getTotalElements());
    }

}
