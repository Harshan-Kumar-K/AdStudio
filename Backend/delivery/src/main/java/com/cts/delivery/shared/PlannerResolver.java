package com.cts.delivery.shared;

import com.cts.delivery.client.MediaPlanFeignClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class PlannerResolver {

    private final MediaPlanFeignClient mediaPlanClient;

    private static final Integer FALLBACK_USER_ID = 1; // used if the lookup fails for any reason

    public Integer resolvePlannerId(Long lineItemId) {
        try {
            var lineItem = mediaPlanClient.getLineItem(lineItemId.intValue()).data();
            if (lineItem == null || lineItem.planId() == null) return FALLBACK_USER_ID;

            var plan = mediaPlanClient.getMediaPlan(lineItem.planId()).data();
            if (plan == null || plan.plannerId() == null) return FALLBACK_USER_ID;

            return plan.plannerId();
        } catch (Exception e) {
            log.warn("Could not resolve planner for line item {}: {}", lineItemId, e.getMessage());
            return FALLBACK_USER_ID;
        }
    }
}