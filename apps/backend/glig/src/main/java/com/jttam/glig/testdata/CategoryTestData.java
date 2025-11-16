package com.jttam.glig.testdata;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.jttam.glig.domain.category.CategoryRepository;
import com.jttam.glig.domain.category.Category;

@Component
public class CategoryTestData {

    private final CategoryRepository categoryRepository;

    public CategoryTestData(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public Map<String, Category> createTestCategories() {

        Map<String, Category> categories = new HashMap<>();

        Category garden = categoryRepository.save(new Category("Garden"));
        categories.put("GARDEN", garden);

        Category yard = categoryRepository.save(new Category("Yard"));
        categories.put("YARD", yard);

        Category forestWork = categoryRepository.save(new Category("Forest work"));
        categories.put("FORESTWORK", forestWork);

        Category household = categoryRepository.save(new Category("Household"));
        categories.put("HOUSEHOLD", household);

        Category cleaning = categoryRepository.save(new Category("Cleaning"));
        categories.put("CLEANING", cleaning);

        Category moving = categoryRepository.save(new Category("Moving"));
        categories.put("MOVING", moving);

        Category repair = categoryRepository.save(new Category("Repair"));
        categories.put("REPAIR", repair);

        Category painting = categoryRepository.save(new Category("Painting"));
        categories.put("PAINTING", painting);

        Category snowRemoval = categoryRepository.save(new Category("Snow removal"));
        categories.put("SNOW_REMOVAL", snowRemoval);

        Category other = categoryRepository.save(new Category("Other"));
        categories.put("OTHER", other);

        return categories;
    }

    public void cleanUp() {
        categoryRepository.deleteAll();
    }
}
