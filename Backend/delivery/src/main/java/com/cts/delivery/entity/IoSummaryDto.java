package com.cts.delivery.entity;

public record IoSummaryDto(

        Long ioId,

        int totalDeliveries,

        int deliveredCount,

        int pendingCount

) {

}