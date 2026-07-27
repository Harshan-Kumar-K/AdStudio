package com.cts.delivery.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "notification")   // <-- the SERVICE NAME, not a URL!
public interface NotificationFeignClient {

    @PostMapping("/api/notifications")
    void send(@RequestBody NotificationPayload payload);

    record NotificationPayload(Integer userId, String message, String category) {}
}