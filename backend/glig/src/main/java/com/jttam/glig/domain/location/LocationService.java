package com.jttam.glig.domain.location;

import com.jttam.glig.domain.location.dto.LocationResponse;
import com.jttam.glig.exception.custom.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LocationService {

    private final LocationRepository locationRepository;
    private final LocationMapper locationMapper;

    @Autowired
    public LocationService(LocationRepository locationRepository, LocationMapper locationMapper) {
        this.locationRepository = locationRepository;
        this.locationMapper = locationMapper;
    }

    /**
     * Retrieves a location by its ID.
     */
    @Transactional(readOnly = true)
    public LocationResponse getLocation(Integer locationId) {
        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new NotFoundException("NOT_FOUND", "Location not found with id: " + locationId));
        return locationMapper.toLocationResponse(location);
    }
}