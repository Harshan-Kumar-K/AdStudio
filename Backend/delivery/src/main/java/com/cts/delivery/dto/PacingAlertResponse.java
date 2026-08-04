package com.cts.delivery.dto;

import java.time.LocalDate;

import com.cts.delivery.entity.AlertType;
import com.cts.delivery.entity.PacingAlert.AlertStatus;

public record PacingAlertResponse(

        Long alertId,

        Long lineItemId,

        AlertType alertType,

        LocalDate alertDate,

        Double pacingPercent,

        AlertStatus status

) {
}