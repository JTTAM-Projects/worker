package com.jttam.glig.domain.application;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import com.jttam.glig.domain.application.dto.ApplicationResponse;
import com.jttam.glig.domain.application.dto.MyApplicationDTO;
import com.jttam.glig.domain.category.CategoryMapper;
import com.jttam.glig.domain.application.dto.TaskApplicantDto;
import com.jttam.glig.domain.application.dto.ApplicationRequest;
import com.jttam.glig.domain.task.TaskMapper;
import com.jttam.glig.domain.user.UserMapper;

@Mapper(componentModel = "spring", uses = { TaskMapper.class, UserMapper.class, CategoryMapper.class })
public interface ApplicationMapper {

    ApplicationResponse toApplicationResponse(Application applcation);

    MyApplicationDTO toMyApplicationDTO(Application application);

    @Mapping(target = "appliedUser", source = "user")
    TaskApplicantDto toApplicationListDTO(Application application);

    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "applicationStatus", ignore = true)
    @Mapping(target = "task", ignore = true)
    @Mapping(target = "user", ignore = true)
    Application toApplicationEntity(ApplicationRequest applicationDto);

    List<TaskApplicantDto> toTaskApplicantListDto(List<Application> applications);

    default Page<TaskApplicantDto> toTaskApplicantListPage(Page<Application> page) {
        List<TaskApplicantDto> dtoList = toTaskApplicantListDto(page.getContent());
        return new PageImpl<>(dtoList, page.getPageable(), page.getTotalElements());
    }

    List<MyApplicationDTO> toMyApplicationDtoList(List<Application> applications);

    default Page<MyApplicationDTO> toMyApplicationDtoListPage(Page<Application> page) {
        List<MyApplicationDTO> dtoList = toMyApplicationDtoList(page.getContent());
        return new PageImpl<>(dtoList, page.getPageable(), page.getTotalElements());
    }

    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "applicationStatus", ignore = true)
    @Mapping(target = "task", ignore = true)
    @Mapping(target = "user", ignore = true)
    Application updateApplication(ApplicationRequest applicationRequest, @MappingTarget Application application);

}
