package com.cts.delivery.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cts.delivery.entity.DeliveryRecord;

public interface DeliveryRecordRepository
        extends JpaRepository<DeliveryRecord, Long> {

    boolean existsByLineItemIdAndIoIdAndReportingDate(
            Long lineItemId,
            Long ioId,
            LocalDate reportingDate
    );

    List<DeliveryRecord> findByLineItemId(
            Long lineItemId
    );
    List<DeliveryRecord> findByIoId(Long ioId);
}