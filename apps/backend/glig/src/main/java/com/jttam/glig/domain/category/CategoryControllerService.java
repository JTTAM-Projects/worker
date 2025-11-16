package com.jttam.glig.domain.category;

import java.util.List;

import org.springframework.stereotype.Service;

import com.jttam.glig.domain.category.dto.CategoryResponse;
import com.jttam.glig.exception.custom.NotFoundException;

@Service
public class CategoryControllerService {

    CategoryRepository categoryRepository;
    CategoryMapper mapper;

    public CategoryControllerService(CategoryRepository categoryRepository, CategoryMapper mapper) {
        this.categoryRepository = categoryRepository;
        this.mapper = mapper;
    }

    public CategoryResponse getCategoryByGivenId(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("CATEGORY_NOT_FOUND", "Unable to find category by given id"));

        return mapper.toCategoryResponse(category);
    }

    public List<CategoryResponse> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return mapper.toCategoryResponseList(categories);
    }

}
