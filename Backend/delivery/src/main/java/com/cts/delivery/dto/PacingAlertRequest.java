package com.cts.delivery.dto;

import com.cts.delivery.entity.PacingAlert.AlertType;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record PacingAlertRequest(

        @NotNull
        Long lineItemId,


        @NotNull
        BigDecimal spend

) {
}