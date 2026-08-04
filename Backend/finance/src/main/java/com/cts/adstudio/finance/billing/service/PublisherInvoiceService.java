package com.cts.adstudio.finance.billing.service;

import com.cts.adstudio.finance.billing.client.DeliveryFeignClient;
import com.cts.adstudio.finance.billing.dto.DeliveryRecordResponse;
import com.cts.adstudio.finance.billing.dto.PublisherInvoiceResponse;
import com.cts.adstudio.finance.billing.dto.ReconciliationResultResponse;
import com.cts.adstudio.finance.billing.dto.SubmitPublisherInvoiceRequest;
import com.cts.adstudio.finance.billing.entity.PublisherInvoice;
import com.cts.adstudio.finance.billing.enums.PublisherInvoiceStatus;
import com.cts.adstudio.finance.billing.exception.BillingRuleException;
import com.cts.adstudio.finance.billing.exception.InvoiceNotFoundException;
import com.cts.adstudio.finance.billing.repository.PublisherInvoiceRepository;
import com.cts.adstudio.finance.billing.shared.NotificationClient;
import com.cts.adstudio.finance.shared.AuditLogService;
import com.cts.adstudio.finance.shared.BudgetCalculationService;
import com.cts.adstudio.finance.shared.StatusTransitionValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PublisherInvoiceService {

    /** Absolute variance treated as a clean match during reconciliation. */
    public static final BigDecimal RECONCILE_TOLERANCE = new BigDecimal("0.01");

    private final PublisherInvoiceRepository repository;
    private final StatusTransitionValidator statusValidator;
    private final AuditLogService auditLog;
    private final BudgetCalculationService budgetCalc;
    private final NotificationClient notificationClient;
    private final DeliveryFeignClient deliveryFeignClient;

    public PublisherInvoice getEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new InvoiceNotFoundException("PublisherInvoice", id));
    }

    public PublisherInvoiceResponse get(Long id) {
        return PublisherInvoiceResponse.from(getEntity(id));
    }

    public Page<PublisherInvoiceResponse> list(
            Long publisherId,
            PublisherInvoiceStatus status,
            Pageable pageable) {

        Page<PublisherInvoice> page;

        if (publisherId != null) {
            page = repository.findByPublisherId(publisherId, pageable);
        } else if (status != null) {
            page = repository.findByStatus(status, pageable);
        } else {
            page = repository.findAll(pageable);
        }

        return page.map(PublisherInvoiceResponse::from);
    }

    @Transactional
    public PublisherInvoiceResponse submit(
            SubmitPublisherInvoiceRequest req,
            Long actingUserId) {

        PublisherInvoice invoice = PublisherInvoice.builder()
                .publisherId(req.publisherId())
                .ioId(req.ioId())
                .invoiceAmount(req.invoiceAmount())
                .deliveredValue(BigDecimal.ZERO)
                .varianceAmount(BigDecimal.ZERO)
                .receivedDate(
                        req.receivedDate() != null
                                ? req.receivedDate()
                                : LocalDate.now())
                .status(PublisherInvoiceStatus.RECEIVED)
                .build();

        PublisherInvoice saved = repository.save(invoice);

        auditLog.log(
                actingUserId,
                "PUBLISHER_INVOICE_RECEIVED",
                "PublisherInvoice",
                saved.getId());

        notificationClient.notify(
                saved.getPublisherId(),
                "Publisher Invoice #" + saved.getId()
                        + " was submitted and marked as RECEIVED.",
                "PublisherInvoice");

        return PublisherInvoiceResponse.from(saved);
    }

    /**
     * Reconcile against delivered value; sets variance and
     * RECONCILED / DISCREPANCY.
     */
    @Transactional
    public ReconciliationResultResponse reconcile(
            Long id,
            Long actingUserId) {

        PublisherInvoice invoice = getEntity(id);
        List<DeliveryRecordResponse> record = deliveryFeignClient.getDeliveryRecordsByIoId(invoice.getIoId());
        // Sum the spend values of all delivery records, or return zero if the list is null
        BigDecimal deliverySpend = record != null ? record.stream().map(DeliveryRecordResponse::spend).reduce(BigDecimal.ZERO, BigDecimal::add) : BigDecimal.ZERO;

//        BigDecimal deliveredValue =
//                budgetCalc.deliveredValueForInsertionOrder(invoice.getIoId());

        BigDecimal variance =
                invoice.getInvoiceAmount().subtract(deliverySpend);

        PublisherInvoiceStatus target =
                variance.abs().compareTo(RECONCILE_TOLERANCE) <= 0
                        ? PublisherInvoiceStatus.RECONCILED
                        : PublisherInvoiceStatus.DISCREPANCY;

        statusValidator.validate(invoice.getStatus(), target);

        invoice.setDeliveredValue(deliverySpend);
        invoice.setVarianceAmount(variance);
        invoice.setStatus(target);

        PublisherInvoice saved = repository.save(invoice);

        auditLog.log(
                actingUserId,
                "PUBLISHER_INVOICE_RECONCILED",
                "PublisherInvoice",
                id);

        notificationClient.notify(
                saved.getPublisherId(),
                "Publisher Invoice #" + id
                        + " reconciliation completed with status "
                        + target + ".",
                "PublisherInvoice");

        return ReconciliationResultResponse.from(saved);
    }

    @Transactional
    public PublisherInvoiceResponse changeStatus(
            Long id,
            String targetStatus,
            Long actingUserId) {

        PublisherInvoice invoice = getEntity(id);

        PublisherInvoiceStatus target = parseStatus(targetStatus);

        statusValidator.validate(invoice.getStatus(), target);

        invoice.setStatus(target);

        PublisherInvoice saved = repository.save(invoice);

        auditLog.log(
                actingUserId,
                "PUBLISHER_INVOICE_STATUS_" + target.name(),
                "PublisherInvoice",
                id);

        notificationClient.notify(
                saved.getPublisherId(),
                "Publisher Invoice #" + id
                        + " status changed to "
                        + target + ".",
                "PublisherInvoice");

        return PublisherInvoiceResponse.from(saved);
    }

    private PublisherInvoiceStatus parseStatus(String raw) {
        try {
            return PublisherInvoiceStatus.valueOf(
                    raw.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BillingRuleException(
                    "Unknown publisher invoice status: " + raw);
        }
    }
}