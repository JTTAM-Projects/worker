package com.jttam.glig.testdata;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/test-database")
@Tag(name = "Test", description = "Operations related to testing.")
public class TestDataController {

    private final TestDataService testDataService;
    private final TestDataControllerService testDataControllerService;

    public TestDataController(TestDataService testDataService, TestDataControllerService testDataControllerService) {
        this.testDataService = testDataService;
        this.testDataControllerService = testDataControllerService;
    }

    @Operation(summary = "Reset database to original state", description = "Deleting everything and creating database again with default data.")
    @PostMapping("/reset")
    public ResponseEntity<?> resetDataBaseWithOriginalData() {
        testDataService.createAllTestData();
        return ResponseEntity.ok().body("Database reseted succesfully");
    }

}
