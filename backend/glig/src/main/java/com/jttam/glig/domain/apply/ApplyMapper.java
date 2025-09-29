package com.jttam.glig.domain.apply;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import com.jttam.glig.domain.task.TaskMapper;
import com.jttam.glig.domain.user.UserMapper;

@Mapper(componentModel = "spring", uses = { TaskMapper.class, UserMapper.class })
public interface ApplyMapper {

    ApplyDto toApplyDTO(Apply apply);

    Apply toApplyEntity(ApplyDto applyDto);

    List<ApplyListDTO> toApplyDtoList(List<Apply> applies);

    Apply updateApply(ApplyDto applyDto, @MappingTarget Apply apply);

}
