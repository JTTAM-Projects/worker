package com.jttam.glig.domain.application;

import java.util.Set;

public record ApplicationDataGridFilters(
        String searchText,
        ApplicationStatus applicationStatus,
        Set<String> categories,
        Integer applicationMinPrice,
        Integer applicationMaxPrice) {
}
