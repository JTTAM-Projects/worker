package com.jttam.glig.domain.location;

import com.jttam.glig.domain.location.dto.LocationResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/locations")
public class LocationController {

    private final LocationService locationService;

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    /**
     * NECESSARY: Gets the full details of a single location by its ID.
     * This is used to display the location(s) for a specific Task.
     */
    @GetMapping("/{id}")
    public ResponseEntity<LocationResponse> getLocationById(@PathVariable Long id) {
        LocationResponse response = locationService.getLocation(id);
        return ResponseEntity.ok(response);
    }
}