package com.jttam.glig.domain.taskerprofile;

import com.jttam.glig.domain.taskerprofile.dto.TaskerProfileRequest;
import com.jttam.glig.domain.taskerprofile.dto.TaskerProfileResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface TaskerProfileMapper {

    @Mapping(target = "taskerProfileId", ignore = true)
    @Mapping(target = "averageRating", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "verified", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    TaskerProfile toEntity(TaskerProfileRequest request);

    @Mapping(target = "userId", source = "user.userName")
    TaskerProfileResponse toResponse(TaskerProfile taskerProfile);

    @Mapping(target = "taskerProfileId", ignore = true)
    @Mapping(target = "averageRating", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "verified", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    void updateFromRequest(TaskerProfileRequest request, @MappingTarget TaskerProfile taskerProfile);
}