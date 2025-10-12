package com.jttam.glig.testdata;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.jttam.glig.domain.location.Location;
import com.jttam.glig.domain.location.LocationRepository;

@Component
public class LocationTestData {

    private final LocationRepository locationRepository;

    public LocationTestData(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    public Map<String, Location> createTestLocations() {

        Map<String, Location> locations = new HashMap<>();

        Location loc1 = locationRepository.save(new Location(
                "koe-streetAddress",
                "00001",
                "koe-city",
                "koe-country",
                new BigDecimal("60.16952"),
                new BigDecimal("24.93545")));

        locations.put("koe", loc1);

        Location loc2 = locationRepository.save(new Location(
                "testi-address",
                "00002",
                "testi-city",
                "testi-country",
                new BigDecimal("61.49911"),
                new BigDecimal("23.78712")));

        locations.put("testi", loc2);

        return locations;
    }

    public void cleanUp() {
        locationRepository.deleteAll();
    }

}
