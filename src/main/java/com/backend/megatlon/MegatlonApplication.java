package com.backend.megatlon;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling //añadido
public class MegatlonApplication {

	public static void main(String[] args) {
		SpringApplication.run(MegatlonApplication.class, args);
	}
}