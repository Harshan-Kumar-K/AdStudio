package com.cts.adstudio.mediaplan.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {

    // Used by NotificationClient to call the notification service directly.
    //Makes HTTP calls to another service
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
