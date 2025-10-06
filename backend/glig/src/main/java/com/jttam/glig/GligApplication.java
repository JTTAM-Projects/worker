package com.jttam.glig;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import com.jttam.glig.testdata.TestDataService;

@SpringBootApplication
public class GligApplication implements CommandLineRunner {

	@Autowired
	private TestDataService testDataService;

	public static void main(String[] args) {
		SpringApplication.run(GligApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		testDataService.createAllTestData();
	}

}
