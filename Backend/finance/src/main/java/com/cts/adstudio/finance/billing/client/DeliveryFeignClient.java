package com.cts.adstudio.finance.billing.client;

import com.cts.adstudio.finance.billing.dto.DeliveryRecordResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;


@FeignClient(name = "delivery")
public interface DeliveryFeignClient {

    @GetMapping("/api/delivery-records/io/{ioId}")
    List<DeliveryRecordResponse> getDeliveryRecordsByIoId(@PathVariable("ioId") Long ioId);
}