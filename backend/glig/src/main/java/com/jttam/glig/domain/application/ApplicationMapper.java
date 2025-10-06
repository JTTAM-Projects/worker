package com.jttam.glig.domain.application;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import com.jttam.glig.domain.task.TaskMapper;
import com.jttam.glig.domain.user.UserMapper;

@Mapper(componentModel = "spring", uses = { TaskMapper.class, UserMapper.class })
public interface ApplicationMapper {

    ApplicationDto toApplicationDTO(Application apply);

    @Mapping(target = "category", source = "task.category")
    @Mapping(target = "taskTitle", source = "task.title")
    @Mapping(target = "user", source = "task.user")
    ApplicationListDTO toApplicationListDTO(Application apply);

    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Application toApplicationEntity(ApplicationDto applyDto);

    List<ApplicationListDTO> toApplicationDtoList(List<Application> applies);

    default Page<ApplicationListDTO> toApplicationDtoListPage(Page<Application> page) {
        List<ApplicationListDTO> dtoList = toApplicationDtoList(page.getContent());
        return new PageImpl<>(dtoList, page.getPageable(), page.getTotalElements());
    }

    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Application updateApplication(ApplicationDto applyDto, @MappingTarget Application apply);

}
