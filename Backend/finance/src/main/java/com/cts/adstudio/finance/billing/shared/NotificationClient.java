package com.cts.adstudio.finance.billing.shared;

import com.cts.adstudio.finance.billing.client.NotificationFeignClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationClient {

    private final NotificationFeignClient feignClient;

    public void notify(Long userId, String message, String category) {
        try {
            feignClient.send(new NotificationFeignClient.NotificationPayload(userId, message, category));
        } catch (Exception e) {
            log.warn("Notification not sent (user={}, category={}): {}", userId, category, e.getMessage());
        }
    }
}