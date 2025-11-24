package com.jttam.glig.domain.task;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import com.jttam.glig.domain.application.ApplicationMapper;
import com.jttam.glig.domain.application.ApplicationStatus;
import com.jttam.glig.domain.category.CategoryMapper;
import com.jttam.glig.domain.location.LocationMapper;
import com.jttam.glig.domain.task.dto.TaskResponse;
import com.jttam.glig.domain.task.dto.ApplicationListTaskDto;
import com.jttam.glig.domain.task.dto.TaskListDTO;
import com.jttam.glig.domain.task.dto.TaskRequest;
import com.jttam.glig.domain.user.User;
import com.jttam.glig.domain.user.UserMapper;

@Mapper(componentModel = "spring", uses = { UserMapper.class, ApplicationMapper.class, LocationMapper.class,
        CategoryMapper.class
})
public interface TaskMapper {

    @Mapping(target = "worker", expression = "java(getAcceptedWorker(task))")
    TaskResponse toTaskResponse(Task task);

    ApplicationListTaskDto toApplicationListTaskDto(Task task);

    TaskListDTO toTaskList(Task task);

    @Mapping(target = "applies", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "categories", ignore = true)
    @Mapping(target = "locations", ignore = true)
    Task toTaskEntity(TaskRequest taskRequest);

    @Mapping(target = "applies", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "categories", ignore = true)
    @Mapping(target = "locations", ignore = true)
    Task updateTask(TaskRequest taskRequestBody, @MappingTarget Task task);

    List<TaskListDTO> toTaskResponseList(List<Task> tasks);

    default Page<TaskListDTO> toTaskListDtoPage(Page<Task> page) {
        List<TaskListDTO> dtoList = toTaskResponseList(page.getContent());
        return new PageImpl<>(dtoList, page.getPageable(), page.getTotalElements());
    }

    default User getAcceptedWorker(Task task) {
        if (task == null || task.getApplies() == null)
            return null;
        return task.getApplies().stream()
                .filter(a -> a.getApplicationStatus() == ApplicationStatus.ACCEPTED)
                .map(a -> a.getUser())
                .findFirst()
                .orElse(null);
    }
}
