package com.cts.delivery.shared;

import com.cts.delivery.client.NotificationFeignClient;
import com.cts.delivery.client.NotificationFeignClient.NotificationPayload;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationClient {

    private final NotificationFeignClient feignClient;

    public void notify(Integer userId, String message, String category) {
        try {
            feignClient.send(new NotificationPayload(userId, message, category));
        } catch (Exception e) {
            log.warn("Notification not sent (user={}, category={}): {}", userId, category, e.getMessage());
        }
    }
}