package com.jttam.glig.domain.application;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import com.jttam.glig.domain.application.dto.ApplicationResponse;
import com.jttam.glig.domain.category.CategoryMapper;
import com.jttam.glig.domain.application.dto.ApplicationListDTO;
import com.jttam.glig.domain.application.dto.ApplicationRequest;
import com.jttam.glig.domain.task.TaskMapper;
import com.jttam.glig.domain.user.UserMapper;

@Mapper(componentModel = "spring", uses = { TaskMapper.class, UserMapper.class, CategoryMapper.class })
public interface ApplicationMapper {

    ApplicationResponse toApplicationResponse(Application apply);

    @Mapping(target = "taskTitle", source = "task.title")
    @Mapping(target = "user", source = "task.user")
    @Mapping(target = "categories", source = "task.categories")
    ApplicationListDTO toApplicationListDTO(Application apply);

    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "applicationStatus", ignore = true)
    @Mapping(target = "task", ignore = true)
    @Mapping(target = "user", ignore = true)
    Application toApplicationEntity(ApplicationRequest applyDto);

    List<ApplicationListDTO> toApplicationResponseList(List<Application> applies);

    default Page<ApplicationListDTO> toApplicationResponseListPage(Page<Application> page) {
        List<ApplicationListDTO> dtoList = toApplicationResponseList(page.getContent());
        return new PageImpl<>(dtoList, page.getPageable(), page.getTotalElements());
    }

    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "applicationStatus", ignore = true)
    @Mapping(target = "task", ignore = true)
    @Mapping(target = "user", ignore = true)
    Application updateApplication(ApplicationRequest applicationRequest, @MappingTarget Application apply);

}
