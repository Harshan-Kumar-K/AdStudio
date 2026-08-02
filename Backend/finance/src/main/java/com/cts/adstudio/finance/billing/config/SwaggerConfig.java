package com.cts.adstudio.finance.billing.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI financeOpenAPI() {

        return new OpenAPI()
                .info(
                        new Info()
                                .title("Finance Service API")
                                .version("1.0")
                                .description("AdStudio Finance Microservice")
                                .contact(
                                        new Contact()
                                                .name("CTS Team")
                                                .email("support@adstudio.com")
                                )
                );
    }
}