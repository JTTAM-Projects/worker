package com.jttam.glig.domain.location;

import com.jttam.glig.domain.location.dto.LocationRequest;
import com.jttam.glig.domain.location.dto.LocationResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface LocationMapper {

    LocationResponse toLocationResponse(Location location);

    @Mapping(target = "locationId", ignore = true)
    Location toLocation(LocationRequest request);

    @Mapping(target = "locationId", ignore = true)
    void updateLocationFromDto(LocationRequest request, @MappingTarget Location location);
}
