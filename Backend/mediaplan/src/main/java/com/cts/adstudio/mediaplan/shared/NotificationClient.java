package com.cts.adstudio.mediaplan.shared;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

/**
 * Calls the notification service so users get told about media-plan-side
 * events (plan/line-item/insertion-order created, updated, deleted, or
 * changed status). A notification failure must never break the actual
 * business operation, so every call is caught and just logged as a warning.
 */
@Component
@Slf4j
public class NotificationClient {

    private final RestTemplate restTemplate;
    private final String notificationBaseUrl;

    public NotificationClient(RestTemplate restTemplate,
                               @Value("${notification.service.base-url}") String notificationBaseUrl) {
        this.restTemplate = restTemplate;
        this.notificationBaseUrl = notificationBaseUrl;
    }

    public void notify(Integer userId, String message, String category) {
        try {
            restTemplate.postForEntity(
                    notificationBaseUrl + "/api/notifications",
                    new NotificationPayload(userId, message, category),
                    Void.class);
        } catch (Exception e) {
            log.warn("Notification not sent (user={}, category={}): {}", userId, category, e.getMessage());
        }
    }

    @Data
    @AllArgsConstructor
    private static class NotificationPayload {
        private Integer userId;
        private String message;
        private String category;
    }
}
