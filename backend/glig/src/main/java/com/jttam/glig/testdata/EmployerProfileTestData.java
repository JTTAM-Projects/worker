package com.jttam.glig.testdata;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.jttam.glig.domain.employerprofile.EmployerProfile;
import com.jttam.glig.domain.employerprofile.EmployerProfileRepository;
import com.jttam.glig.domain.employerprofile.EmployerType;
import com.jttam.glig.domain.user.User;

@Component
public class EmployerProfileTestData {

    private EmployerProfileRepository employerProfileRepository;

    public EmployerProfileTestData(EmployerProfileRepository employerProfileRepository) {
        this.employerProfileRepository = employerProfileRepository;
    }

    public Map<String, EmployerProfile> createTestEmployerProfiles(Map<String, User> users) {
        Map<String, EmployerProfile> employerProfiles = new HashMap<>();

        // Create employer profile for auth0 test user
        User auth0User = users.get("auth0");
        if (auth0User != null) {
            EmployerProfile auth0EmployerProfile = new EmployerProfile(
                    auth0User,
                    EmployerType.COMPANY,
                    "Testikatu 1",
                    "00100",
                    "Helsinki",
                    "Finland",
                    "Test company for development purposes",
                    "Test Company Oy",
                    "1234567-8",
                    "https://testcompany.fi",
                    "https://via.placeholder.com/150",
                    false);
            auth0EmployerProfile.setFirstName("Test");
            auth0EmployerProfile.setLastName("Employer");
            employerProfiles.put("auth0Employer", employerProfileRepository.save(auth0EmployerProfile));
        }

        // Create employer profile for user1
        User user1 = users.get("user1");
        if (user1 != null) {
            EmployerProfile user1EmployerProfile = new EmployerProfile(
                    user1,
                    EmployerType.INDIVIDUAL,
                    "Mallikatu 5",
                    "00200",
                    "Espoo",
                    "Finland",
                    "Individual employer looking for workers",
                    "Yksityishenkilö",
                    "9876543-2",
                    "https://example.com",
                    "https://via.placeholder.com/150",
                    false);
            user1EmployerProfile.setFirstName("Matti");
            user1EmployerProfile.setLastName("Meikäläinen");
            employerProfiles.put("user1Employer", employerProfileRepository.save(user1EmployerProfile));
        }

        return employerProfiles;
    }

    public void cleanUp() {
        employerProfileRepository.deleteAll();
    }
}
