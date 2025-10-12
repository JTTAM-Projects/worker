package com.jttam.glig.domain.category;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.jttam.glig.domain.category.dto.CategoryRequest;
import com.jttam.glig.domain.category.dto.CategoryResponse;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    CategoryResponse toCategoryResponse(Category category);

    List<CategoryResponse> toCategoryResponseList(List<Category> categories);

    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "categoryId", ignore = true)
    @Mapping(target = "tasks", ignore = true)
    Category toCategoryEntity(CategoryRequest categoryRequest);

}
