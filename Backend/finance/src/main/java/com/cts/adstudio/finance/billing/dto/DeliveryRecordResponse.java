package com.cts.adstudio.finance.billing.dto;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.math.BigDecimal;
import java.time.LocalDate;

@JsonIgnoreProperties(ignoreUnknown = true)
public record DeliveryRecordResponse(
        Long lineItemId,
        Long ioId,
        LocalDate reportingDate,
        BigDecimal spend
) {}