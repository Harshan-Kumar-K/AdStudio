package com.cts.advertiser;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class AdvertiserApplication {

	public static void main(String[] args) {
		SpringApplication.run(AdvertiserApplication.class, args);
	}

}
