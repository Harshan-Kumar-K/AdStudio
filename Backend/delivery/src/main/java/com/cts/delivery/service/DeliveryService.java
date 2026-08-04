package com.cts.delivery.service;

import java.util.List;

import com.cts.delivery.entity.IoSummaryDto;
import com.cts.delivery.shared.NotificationClient;
import com.cts.delivery.shared.PlannerResolver;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cts.delivery.dto.DeliveryRequest;
import com.cts.delivery.dto.PacingSummaryResponse;
import com.cts.delivery.entity.DeliveryRecord;
import com.cts.delivery.deliveryexception.DeliveryNotFoundException;
import com.cts.delivery.repository.DeliveryRecordRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class DeliveryService {

    private final DeliveryRecordRepository repository;
    private final NotificationClient notificationClient;
    private final PlannerResolver plannerResolver;

    public DeliveryRecord create(
            DeliveryRequest request) {

        if (repository
                .existsByLineItemIdAndIoIdAndReportingDate(
                        request.lineItemId(),
                        request.ioId(),
                        request.reportingDate())) {

            throw new RuntimeException(
                    "Duplicate delivery record detected");
        }

        var record = DeliveryRecord.builder()
                .lineItemId(request.lineItemId())
                .ioId(request.ioId())
                .reportingDate(request.reportingDate())
                .deliveredImpressions(
                        request.deliveredImpressions())
                .clicks(request.clicks())
                .spend(request.spend())
                .source(
                        DeliveryRecord.Source.valueOf(
                                request.source()))
                .status(
                        DeliveryRecord.Status.valueOf(
                                request.status()))
                .build();

        DeliveryRecord saved = repository.save(record);
        Integer plannerId = plannerResolver.resolvePlannerId(saved.getLineItemId());
        notificationClient.notify(plannerId,
                "Delivery Logged for line item #" + saved.getLineItemId()
                        + ": " + saved.getDeliveredImpressions() + " impressions.",
                "Delivery");

        return saved;
    }

    public List<DeliveryRecord> getIoDeliveries(Long ioId) {

        return repository.findByIoId(ioId);
    }

    public IoSummaryDto getIoSummary(Long ioId) {
        List<DeliveryRecord> records =     repository.findByIoId(ioId);

        int total = records.size();
        int delivered = (int) records.stream()
                .filter(r -> "Delivered".equals(r.getStatus()))
                .count();

        int pending = (int) records.stream()
                .filter(r -> "Pending".equals(r.getStatus()))
                .count();

        return new IoSummaryDto(
                ioId,
                total,
                delivered,
                pending
        );

    }

    public List<DeliveryRecord> getAll() {
        return repository.findAll();
    }

    public DeliveryRecord getById(Long id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new DeliveryNotFoundException(
                                "Delivery Record Not Found"));
    }

    public void delete(Long id) {

        var record = getById(id);

        repository.delete(record);
        Integer plannerId = plannerResolver.resolvePlannerId(record.getLineItemId());
        notificationClient.notify(plannerId,
                "Delivery Record #" + id + " (line item #" + record.getLineItemId() + ") was deleted.",
                "Delivery");
    }

    public List<DeliveryRecord> getLineItemDeliveries(
            Long lineItemId) {

        return repository.findByLineItemId(
                lineItemId);
    }

    public PacingSummaryResponse getPacingSummary(
            Long lineItemId) {

        var records =
                repository.findByLineItemId(
                        lineItemId);

        long impressions =
                records.stream()
                        .mapToLong(
                                DeliveryRecord::getDeliveredImpressions)
                        .sum();

        long clicks =
                records.stream()
                        .mapToLong(
                                DeliveryRecord::getClicks)
                        .sum();

        double spend =
                records.stream()
                        .mapToDouble(
                                r -> r.getSpend()
                                        .doubleValue())
                        .sum();

        return new PacingSummaryResponse(
                lineItemId,
                impressions,
                clicks,
                spend
        );
    }
}