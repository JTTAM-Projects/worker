package com.jttam.glig.domain.user;

import java.util.Optional;

public interface UserRepository {

    Optional<User> findByUserName(String userName);
}
