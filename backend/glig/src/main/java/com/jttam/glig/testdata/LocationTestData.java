package com.jttam.glig.testdata;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.springframework.stereotype.Component;

import com.jttam.glig.domain.location.Location;
import com.jttam.glig.domain.location.LocationRepository;

@Component
public class LocationTestData {

    private final LocationRepository locationRepository;
    private final Random random = new Random();

    public LocationTestData(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    /**
     * Creates test locations across major Finnish cities with real coordinates.
     * Distribution: ~60% Helsinki, ~20% Espoo, ~10% Vantaa, ~10% other cities
     * Locations are spread across neighborhoods to demonstrate clustering and individual markers.
     */
    public Map<String, Location> createTestLocations() {
        Map<String, Location> locations = new HashMap<>();
        List<Location> allLocations = new ArrayList<>();

        // ===== HELSINKI (Central) - Major landmarks and neighborhoods =====
        
        // Kamppi, Keskusta
        allLocations.add(createLocation("Mannerheimintie 20", "00100", "Helsinki", "Finland", 
                60.169070, 24.938450));
        
        // Rautatientori
        allLocations.add(createLocation("Kaivokatu 1", "00100", "Helsinki", "Finland", 
                60.171110, 24.943080));
        
        // Kaisaniemi
        allLocations.add(createLocation("Kaisaniemenkatu 3", "00100", "Helsinki", "Finland", 
                60.172090, 24.945360));
        
        // Hakaniemi
        allLocations.add(createLocation("Hakaniemenranta 1", "00530", "Helsinki", "Finland", 
                60.179200, 24.951500));
        
        // Sörnäinen
        allLocations.add(createLocation("Hämeentie 155", "00560", "Helsinki", "Finland", 
                60.191850, 24.963450));
        
        // Kallio
        allLocations.add(createLocation("Vaasankatu 16", "00500", "Helsinki", "Finland", 
                60.183810, 24.950510));
        
        // Kallio - Helsinginkatu
        allLocations.add(createLocation("Helsinginkatu 24", "00530", "Helsinki", "Finland", 
                60.185400, 24.953200));
        
        // Töölö
        allLocations.add(createLocation("Töölönkatu 28", "00250", "Helsinki", "Finland", 
                60.178350, 24.925340));
        
        // Töölö - Opera
        allLocations.add(createLocation("Helsinginkatu 58", "00250", "Helsinki", "Finland", 
                60.180100, 24.928600));
        
        // Pasila
        allLocations.add(createLocation("Pasilanraitio 5", "00240", "Helsinki", "Finland", 
                60.198650, 24.933710));
        
        // Vallila
        allLocations.add(createLocation("Hämeentie 63", "00550", "Helsinki", "Finland", 
                60.195200, 24.954300));
        
        // Arabia
        allLocations.add(createLocation("Hämeentie 135", "00560", "Helsinki", "Finland", 
                60.209850, 24.977200));
        
        // ===== HELSINKI (East) =====
        
        // Herttoniemi
        allLocations.add(createLocation("Linnanrakentajantie 9", "00950", "Helsinki", "Finland", 
                60.203500, 25.034100));
        
        // Itäkeskus
        allLocations.add(createLocation("Itäkatu 1", "00930", "Helsinki", "Finland", 
                60.210950, 25.081200));
        
        // Vuosaari
        allLocations.add(createLocation("Vuotie 45", "00980", "Helsinki", "Finland", 
                60.208450, 25.141380));
        
        // Mellunmäki
        allLocations.add(createLocation("Kontulantie 19", "00940", "Helsinki", "Finland", 
                60.234700, 25.107950));
        
        // ===== HELSINKI (West) =====
        
        // Lauttasaari
        allLocations.add(createLocation("Meripuistotie 3", "00200", "Helsinki", "Finland", 
                60.158850, 24.873900));
        
        // Munkkiniemi
        allLocations.add(createLocation("Ulvilantie 19", "00350", "Helsinki", "Finland", 
                60.199500, 24.876200));
        
        // Pitäjänmäki
        allLocations.add(createLocation("Valimotie 13", "00380", "Helsinki", "Finland", 
                60.223150, 24.862850));
        
        // ===== HELSINKI (North) =====
        
        // Oulunkylä
        allLocations.add(createLocation("Mäkelänkatu 91", "00610", "Helsinki", "Finland", 
                60.224400, 24.975450));
        
        // Maunula
        allLocations.add(createLocation("Metsäpurontie 8", "00630", "Helsinki", "Finland", 
                60.230850, 24.918750));
        
        // Malmi
        allLocations.add(createLocation("Malminkaari 15", "00700", "Helsinki", "Finland", 
                60.251350, 25.010450));
        
        // ===== HELSINKI (South) =====
        
        // Punavuori
        allLocations.add(createLocation("Fredrikinkatu 41", "00120", "Helsinki", "Finland", 
                60.162550, 24.939850));
        
        // Eira
        allLocations.add(createLocation("Merikatu 8", "00150", "Helsinki", "Finland", 
                60.157400, 24.947200));
        
        // Kruununhaka
        allLocations.add(createLocation("Snellmaninkatu 13", "00170", "Helsinki", "Finland", 
                60.170950, 24.955200));
        
        // Katajanokka
        allLocations.add(createLocation("Luotsikatu 3", "00160", "Helsinki", "Finland", 
                60.165600, 24.966500));
        
        // ===== ESPOO (Western neighbors) =====
        
        // Espoon keskus
        allLocations.add(createLocation("Kamreerintie 3", "02770", "Espoo", "Finland", 
                60.205450, 24.656700));
        
        // Tapiola
        allLocations.add(createLocation("Tapionaukio 3", "02100", "Espoo", "Finland", 
                60.176750, 24.805450));
        
        // Leppävaara
        allLocations.add(createLocation("Leppävaarankatu 3", "02600", "Espoo", "Finland", 
                60.219350, 24.813100));
        
        // Matinkylä
        allLocations.add(createLocation("Piispansilta 11", "02230", "Espoo", "Finland", 
                60.162700, 24.754900));
        
        // Espoonlahti
        allLocations.add(createLocation("Sokerilinnantie 3", "02230", "Espoo", "Finland", 
                60.143850, 24.659850));
        
        // Kauniainen (between Helsinki & Espoo)
        allLocations.add(createLocation("Kauniaistentie 10", "02700", "Kauniainen", "Finland", 
                60.210950, 24.730450));
        
        // ===== VANTAA (Northern neighbors) =====
        
        // Tikkurila
        allLocations.add(createLocation("Ratatie 11", "01300", "Vantaa", "Finland", 
                60.293700, 25.041850));
        
        // Myyrmäki
        allLocations.add(createLocation("Iskoskuja 3", "01600", "Vantaa", "Finland", 
                60.274200, 24.845450));
        
        // Martinlaakso
        allLocations.add(createLocation("Marttilankatu 1", "01620", "Vantaa", "Finland", 
                60.283050, 24.857950));
        
        // Hakunila
        allLocations.add(createLocation("Voutilantie 2", "01200", "Vantaa", "Finland", 
                60.280400, 25.091500));
        
        // Aviapolis (near airport)
        allLocations.add(createLocation("Lentäjänkatu 3", "01530", "Vantaa", "Finland", 
                60.317850, 24.968550));
        
        // ===== TAMPERE (Major city north) =====
        
        // Tampere keskusta
        allLocations.add(createLocation("Hämeenkatu 19", "33200", "Tampere", "Finland", 
                61.497850, 23.761200));
        
        // Kaleva, Tampere
        allLocations.add(createLocation("Sammonkatu 47", "33540", "Tampere", "Finland", 
                61.492200, 23.785400));
        
        // Hervanta, Tampere
        allLocations.add(createLocation("Insinöörinkatu 30", "33720", "Tampere", "Finland", 
                61.450450, 23.858850));
        
        // ===== TURKU (Southwest coast) =====
        
        // Turku keskusta
        allLocations.add(createLocation("Aurakatu 5", "20100", "Turku", "Finland", 
                60.451850, 22.267450));
        
        // Kupittaa, Turku
        allLocations.add(createLocation("Ursininkatu 20", "20300", "Turku", "Finland", 
                60.448450, 22.294600));
        
        // ===== OULU (Northern city) =====
        
        // Oulu keskusta
        allLocations.add(createLocation("Isokatu 22", "90100", "Oulu", "Finland", 
                65.012700, 25.471850));
        
        // Kaukovainio, Oulu
        allLocations.add(createLocation("Myllytie 4", "90410", "Oulu", "Finland", 
                65.033200, 25.497200));

        // Save all locations and add to map with indexed keys
        for (int i = 0; i < allLocations.size(); i++) {
            Location saved = locationRepository.save(allLocations.get(i));
            locations.put("loc" + i, saved);
        }

        return locations;
    }

    /**
     * Helper method to create a Location object
     */
    private Location createLocation(String streetAddress, String postalCode, String city, 
                                    String country, double lat, double lng) {
        return new Location(
            streetAddress,
            postalCode,
            city,
            country,
            BigDecimal.valueOf(lat),
            BigDecimal.valueOf(lng)
        );
    }

    /**
     * Gets a random location from the stored locations.
     * Weighted distribution: 60% Helsinki, 20% Espoo, 10% Vantaa, 10% other cities
     */
    public Location getRandomLocation(List<Location> locations) {
        if (locations.isEmpty()) {
            throw new IllegalStateException("No locations available");
        }

        double rand = random.nextDouble();
        
        // Filter locations by city
        List<Location> helsinkiLocs = locations.stream()
                .filter(l -> "Helsinki".equals(l.getCity()))
                .toList();
        List<Location> espooLocs = locations.stream()
                .filter(l -> "Espoo".equals(l.getCity()) || "Kauniainen".equals(l.getCity()))
                .toList();
        List<Location> vantaaLocs = locations.stream()
                .filter(l -> "Vantaa".equals(l.getCity()))
                .toList();
        List<Location> otherLocs = locations.stream()
                .filter(l -> !"Helsinki".equals(l.getCity()) && 
                            !"Espoo".equals(l.getCity()) && 
                            !"Kauniainen".equals(l.getCity()) && 
                            !"Vantaa".equals(l.getCity()))
                .toList();

        // Weighted random selection
        if (rand < 0.60 && !helsinkiLocs.isEmpty()) {
            return helsinkiLocs.get(random.nextInt(helsinkiLocs.size()));
        } else if (rand < 0.80 && !espooLocs.isEmpty()) {
            return espooLocs.get(random.nextInt(espooLocs.size()));
        } else if (rand < 0.90 && !vantaaLocs.isEmpty()) {
            return vantaaLocs.get(random.nextInt(vantaaLocs.size()));
        } else if (!otherLocs.isEmpty()) {
            return otherLocs.get(random.nextInt(otherLocs.size()));
        }
        
        // Fallback to any random location
        return locations.get(random.nextInt(locations.size()));
    }

    public void cleanUp() {
        locationRepository.deleteAll();
    }

}
