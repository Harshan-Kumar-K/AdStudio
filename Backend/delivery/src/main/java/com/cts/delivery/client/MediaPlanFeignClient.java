package com.cts.delivery.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "mediaplan")
public interface MediaPlanFeignClient {

    @GetMapping("/api/line-items/{id}")
    ApiEnvelope<LineItemView> getLineItem(@PathVariable("id") Integer id);

    @GetMapping("/api/media-plans/{id}")
    ApiEnvelope<MediaPlanView> getMediaPlan(@PathVariable("id") Integer id);

    // mediaplan wraps everything in { success, message, data, timestamp } —
    // this record matches that shape so Feign can unwrap it automatically.
    record ApiEnvelope<T>(boolean success, String message, T data) {}

    // only the fields we actually need from each response, everything
    // else in mediaplan's real response just gets ignored
    record LineItemView(Integer lineItemId, Integer planId) {}
    record MediaPlanView(Integer planId, Integer plannerId) {}
}