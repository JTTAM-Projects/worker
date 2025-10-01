package com.jttam.glig.domain.apply;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import com.jttam.glig.domain.task.TaskMapper;
import com.jttam.glig.domain.user.UserMapper;

@Mapper(componentModel = "spring", uses = { TaskMapper.class, UserMapper.class })
public interface ApplyMapper {

    ApplyDto toApplyDTO(Apply apply);

    @Mapping(target = "category", source = "task.category")
    @Mapping(target = "taskTitle", source = "task.title")
    ApplyListDTO toApplyListDTO(Apply apply);

    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Apply toApplyEntity(ApplyDto applyDto);

    List<ApplyListDTO> toApplyDtoList(List<Apply> applies);

    default Page<ApplyListDTO> toApplyDtoListPage(Page<Apply> page) {
        List<ApplyListDTO> dtoList = toApplyDtoList(page.getContent());
        return new PageImpl<>(dtoList, page.getPageable(), page.getTotalElements());
    }

    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Apply updateApply(ApplyDto applyDto, @MappingTarget Apply apply);

}
