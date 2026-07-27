package com.cts.adstudio.mediaplan.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "notification")
public interface NotificationFeignClient {

    @PostMapping("/api/notifications")
    void send(@RequestBody NotificationPayload payload);

    record NotificationPayload(Integer userId, String message, String category) {}
}