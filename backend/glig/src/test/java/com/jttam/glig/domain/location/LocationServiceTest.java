package com.jttam.glig.domain.location;

import com.jttam.glig.domain.location.dto.LocationResponse;
import com.jttam.glig.exception.custom.NotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LocationServiceTest {

    @Mock
    private LocationRepository locationRepository;

    @Mock
    private LocationMapper locationMapper;

    @InjectMocks
    private LocationService locationService;

    private Location location;
    private LocationResponse locationResponse;
    private static final Integer LOCATION_ID = 1;

    @BeforeEach
    void setUp() {
        // Create common test objects
        location = new Location();
        location.setLocationId(LOCATION_ID);
        location.setCity("Helsinki");

        locationResponse = new LocationResponse(
            LOCATION_ID,        // locationId
            null,               // streetAddress
            null,               // postalCode
            "Helsinki",         // city
            null,               // country
            null,               // latitude
            null                // longitude
        );
    }

    @Test
    void getLocation_shouldReturnLocation_whenFound() {
        // Given: We tell the mocks how to behave
        when(locationRepository.findById(LOCATION_ID)).thenReturn(Optional.of(location));
        when(locationMapper.toLocationResponse(location)).thenReturn(locationResponse);

        // When: We call the actual service method
        LocationResponse result = locationService.getLocation(LOCATION_ID);

        // Then: We assert that the result is correct
        assertThat(result).isNotNull();
        assertThat(result.locationId()).isEqualTo(LOCATION_ID);
        assertThat(result.city()).isEqualTo("Helsinki");

        // And verify that the dependencies were called
        verify(locationRepository).findById(LOCATION_ID);
        verify(locationMapper).toLocationResponse(location);
    }

    @Test
    void getLocation_shouldThrowNotFoundException_whenNotFound() {
        // Given: The repository will return an empty optional, simulating a not-found scenario
        when(locationRepository.findById(LOCATION_ID)).thenReturn(Optional.empty());

        // When & Then: We assert that calling the service method throws the expected exception
        assertThrows(NotFoundException.class, () -> {
            locationService.getLocation(LOCATION_ID);
        });

        // And verify that the repository was called
        verify(locationRepository).findById(LOCATION_ID);
    }
}