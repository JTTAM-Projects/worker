package com.jttam.glig.domain.employerprofile;

import com.jttam.glig.domain.employerprofile.dto.CreateEmployerProfileRequest;
import com.jttam.glig.domain.employerprofile.dto.EmployerProfileResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface EmployerProfileMapper {

    EmployerProfileResponse toEmployerProfileResponse(EmployerProfile employerProfile);

    @Mapping(target = "employerProfileId", ignore = true)
    @Mapping(target = "userId", ignore = true) // Keep ignoring userId from the request DTO
    @Mapping(target = "verified", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "status", ignore = true)
    EmployerProfile toEmployerProfile(CreateEmployerProfileRequest request);

    @Mapping(target = "employerProfileId", ignore = true)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "verified", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "status", ignore = true)
    void updateEmployerProfileFromDto(CreateEmployerProfileRequest dto, @MappingTarget EmployerProfile employerProfile);
}