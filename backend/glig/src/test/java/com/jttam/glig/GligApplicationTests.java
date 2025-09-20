package com.jttam.glig;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

import com.jttam.glig.domain.apply.ApplyMapperImpl;
import com.jttam.glig.domain.employerprofile.EmployerProfileMapperImpl;
import com.jttam.glig.domain.task.TaskMapperImpl;

@SpringBootTest
@Import({TaskMapperImpl.class, ApplyMapperImpl.class, EmployerProfileMapperImpl.class})
class GligApplicationTests {

	@Test
	void contextLoads() {
	}

}
