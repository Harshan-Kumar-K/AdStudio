package com.cts.adstudio.notification.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI notificationOpenAPI() {

        return new OpenAPI()
                .info(
                        new Info()
                                .title("Notification Service API")
                                .version("1.0")
                                .description("AdStudio Notification Microservice")
                                .contact(
                                        new Contact()
                                                .name("CTS Team")
                                                .email("support@adstudio.com")
                                )
                );
    }
}