package com.jttam.glig.domain.employerprofile;

import com.jttam.glig.domain.employerprofile.dto.EmployerProfileRequest;
import com.jttam.glig.domain.employerprofile.dto.EmployerProfileResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EmployerProfileMapper {
    @Mapping(target = "userId", source = "user.userName")
    @Mapping(target = "isVerified", source = "verified")
    EmployerProfileResponse toResponse(EmployerProfile employerProfile);

    @Mapping(target = "employerProfileId", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "verified", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    EmployerProfile toEntity(EmployerProfileRequest request);

    @Mapping(target = "employerProfileId", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "verified", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    void updateFromRequest(EmployerProfileRequest request, @MappingTarget EmployerProfile employerProfile);
}