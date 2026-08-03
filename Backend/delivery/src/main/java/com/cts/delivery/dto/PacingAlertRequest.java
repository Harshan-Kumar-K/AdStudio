package com.cts.delivery.dto;


import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record PacingAlertRequest(

        @NotNull
        Long lineItemId,


        @NotNull
        Integer spend,

        @NotNull
        Integer deliveredImpressions,

        @NotNull
        LocalDate reportingDate

) {
}