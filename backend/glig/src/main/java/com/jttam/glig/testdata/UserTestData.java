package com.jttam.glig.testdata;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.jttam.glig.domain.user.User;
import com.jttam.glig.domain.user.UserRepository;

@Component
public class UserTestData {

    private UserRepository userRepository;

    public UserTestData(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Map<String, User> createTestUsers() {
        userRepository.deleteAll();

        Map<String, User> users = new HashMap<>();
        User u1 = new User("User1", "1234567-8", "Testikatu 1", "0401234567", "testi1@testi.com");
        User u2 = new User("User2", "8765432-1", "Mallitie 2", "0507654321", "testi2@testi.com");
        User u3 = new User("User3", "1122334-5", "Esimerkkikatu 3", "0441122334", "testi3@testi.com");
        User u4 = new User("User4", "5566778-9", "Testitie 4", "0455566778", "testi4@testi.com");

        users.put("user1", userRepository.save(u1));
        users.put("user2", userRepository.save(u2));
        users.put("user3", userRepository.save(u3));
        users.put("user4", userRepository.save(u4));

        return users;
    }

    public void cleanUp() {
        userRepository.deleteAll();
    }

}
