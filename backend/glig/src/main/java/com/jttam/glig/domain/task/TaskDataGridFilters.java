package com.jttam.glig.domain.task;

import com.jttam.glig.domain.category.Category;

public record TaskDataGridFilters(Category category, String categoryTitle, TaskStatus status) {

}
