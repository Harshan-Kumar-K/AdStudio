package com.cts.adstudio.finance;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * Billing & Reconciliation microservice. Standalone Spring Boot service with its
 * own database; references advertisers / briefs / publishers / insertion orders
 * by id (those entities live in other services).
 */

@SpringBootApplication
@EnableFeignClients
public class FinanceApplication {

	public static void main(String[] args) {

		SpringApplication.run(FinanceApplication.class, args);
	}

}
