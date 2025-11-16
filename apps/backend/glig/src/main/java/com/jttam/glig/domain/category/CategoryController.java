package com.jttam.glig.domain.category;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jttam.glig.domain.category.dto.CategoryResponse;
import com.jttam.glig.service.GlobalServiceMethods;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("api/categories")
@Tag(name = "Category", description = "Operations related to task categories")
public class CategoryController {

    private final CategoryControllerService categoryControllerService;
    private final GlobalServiceMethods globalServiceMethods;

    public CategoryController(CategoryControllerService categoryControllerService,
            GlobalServiceMethods globalServiceMethods) {
        this.categoryControllerService = categoryControllerService;
        this.globalServiceMethods = globalServiceMethods;
    }

    @Operation(summary = "Get all categories", description = "Fetches a list of all categories")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Categories fetched successfully")
    })
    @GetMapping
    public List<CategoryResponse> getAllCategories() {
        return categoryControllerService.getAllCategories();
    }

    @Operation(summary = "Get a single category", description = "Fetches info for category by given categoryid, returns categoryDto")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Category data fetched successfully"),
            @ApiResponse(responseCode = "404", description = "Category not found")
    })
    @GetMapping("/{id}")
    public CategoryResponse getSingleCategory(@PathVariable Long categoryId) {
        return categoryControllerService.getCategoryByGivenId(categoryId);
    }

}
