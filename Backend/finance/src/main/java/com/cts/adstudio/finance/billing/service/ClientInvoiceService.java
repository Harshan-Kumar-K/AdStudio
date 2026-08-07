package com.cts.adstudio.finance.billing.service;

import com.cts.adstudio.finance.billing.dto.*;
import com.cts.adstudio.finance.billing.entity.ClientInvoice;
import com.cts.adstudio.finance.billing.enums.ClientInvoiceStatus;
import com.cts.adstudio.finance.billing.exception.BillingRuleException;
import com.cts.adstudio.finance.billing.exception.InvoiceNotFoundException;
import com.cts.adstudio.finance.billing.repository.ClientInvoiceRepository;
import com.cts.adstudio.finance.billing.repository.ClientInvoiceSummary;
import com.cts.adstudio.finance.shared.AuditLogService;
import com.cts.adstudio.finance.shared.BudgetCalculationService;
import com.cts.adstudio.finance.billing.shared.NotificationClient;
import com.cts.adstudio.finance.shared.StatusTransitionValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ClientInvoiceService {

    /** Default agency commission when the request omits a rate (15%). */
    public static final BigDecimal DEFAULT_COMMISSION_RATE = new BigDecimal("0.15");

    private final ClientInvoiceRepository repository;
    private final StatusTransitionValidator statusValidator;
    private final AuditLogService auditLog;
    private final BudgetCalculationService budgetCalc;
    private final NotificationClient notificationClient;

    // ---- reads ---------------------------------------------------------------

    public ClientInvoice getEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new InvoiceNotFoundException("ClientInvoice", id));
    }

    public ClientInvoiceResponse get(Long id) {
        return ClientInvoiceResponse.from(getEntity(id));
    }

    public Page<ClientInvoiceResponse> list(ClientInvoiceStatus status, Pageable pageable) {
        Page<ClientInvoice> page = (status == null)
                ? repository.findAll(pageable)
                : repository.findByStatus(status, pageable);

        return page.map(ClientInvoiceResponse::from);
    }

    // ---- create / generate ---------------------------------------------------

    /** Manual creation: Finance supplies the media amount. */
    @Transactional
    public ClientInvoiceResponse create(CreateClientInvoiceRequest req, Long actingUserId) {

        BigDecimal[] c = computeCommercials(
                req.invoiceAmount(),
                req.commissionRate());

        log.info("commission rate calculation: {}", Arrays.toString(c));

        ClientInvoice invoice = ClientInvoice.builder()
                .advertiserId(req.advertiserId())
                .campaignBriefId(req.campaignBriefId())
                .billingPeriod(req.billingPeriod())
                .invoiceAmount(req.invoiceAmount())
                .agencyCommission(c[0])
                .netBillable(c[1])
                .status(ClientInvoiceStatus.DRAFT)
                .build();

        return saveNew(invoice, actingUserId);
    }

    /** Generate from approved delivery: media amount comes from BudgetCalculationService. */
    @Transactional
    public ClientInvoiceResponse generate(GenerateClientInvoiceRequest req, Long actingUserId) {

        BigDecimal mediaAmount =
                budgetCalc.deliveredSpendForCampaign(req.campaignBriefId());

        if (mediaAmount == null || mediaAmount.signum() <= 0) {
            throw new BillingRuleException(
                    "No approved delivery to invoice for campaign "
                            + req.campaignBriefId());
        }

        BigDecimal[] c = computeCommercials(
                mediaAmount,
                req.commissionRate());

        ClientInvoice invoice = ClientInvoice.builder()
                .advertiserId(req.advertiserId())
                .campaignBriefId(req.campaignBriefId())
                .billingPeriod(req.billingPeriod())
                .invoiceAmount(mediaAmount)
                .agencyCommission(c[0])
                .netBillable(c[1])
                .status(ClientInvoiceStatus.DRAFT)
                .build();

        return saveNew(invoice, actingUserId);
    }

    private ClientInvoiceResponse saveNew(ClientInvoice invoice, Long actingUserId) {

        ClientInvoice saved = repository.save(invoice);

        auditLog.log(
                actingUserId,
                "CLIENT_INVOICE_CREATED",
                "ClientInvoice",
                saved.getId());

        notificationClient.notify(
                actingUserId,
                "Client Invoice #" + saved.getId()
                        + " was created and set to DRAFT.",
                "ClientInvoice");

        return ClientInvoiceResponse.from(saved);
    }

    // ---- update --------------------------------------------------------------

    @Transactional
    public ClientInvoiceResponse update(
            Long id,
            UpdateClientInvoiceRequest req,
            Long actingUserId) {

        ClientInvoice invoice = getEntity(id);

        if (invoice.getStatus() != ClientInvoiceStatus.DRAFT) {
            throw new BillingRuleException(
                    "Only DRAFT invoices can be edited");
        }

        BigDecimal[] c = computeCommercials(
                req.invoiceAmount(),
                req.commissionRate());

        invoice.setCampaignBriefId(req.campaignBriefId());
        invoice.setBillingPeriod(req.billingPeriod());
        invoice.setInvoiceAmount(req.invoiceAmount());
        invoice.setAgencyCommission(c[0]);
        invoice.setNetBillable(c[1]);

        ClientInvoice saved = repository.save(invoice);

        auditLog.log(
                actingUserId,
                "CLIENT_INVOICE_UPDATED",
                "ClientInvoice",
                id);

        notificationClient.notify(
                actingUserId,
                "Client Invoice #" + id + " was updated.",
                "ClientInvoice");

        return ClientInvoiceResponse.from(saved);
    }

    // ---- status flow ---------------------------------------------------------

    @Transactional
    public ClientInvoiceResponse changeStatus(
            Long id,
            String targetStatus,
            Long actingUserId) {

        ClientInvoice invoice = getEntity(id);

        ClientInvoiceStatus target = parseStatus(targetStatus);

        statusValidator.validate(invoice.getStatus(), target);

        invoice.setStatus(target);

        if (target == ClientInvoiceStatus.ISSUED
                && invoice.getIssuedDate() == null) {
            invoice.setIssuedDate(LocalDate.now());
        }

        ClientInvoice saved = repository.save(invoice);

        auditLog.log(
                actingUserId,
                "CLIENT_INVOICE_STATUS_" + target.name(),
                "ClientInvoice",
                id);

        notificationClient.notify(
                actingUserId,
                "Client Invoice #" + id
                        + " status changed to "
                        + target + ".",
                "ClientInvoice");

        return ClientInvoiceResponse.from(saved);
    }

    // ---- payment tracker -----------------------------------------------------

    public PaymentTrackerDTO getPaymentTracker() {
        ClientInvoiceSummary summary = repository.getPaymentSummary();

        PaymentTrackerDTO dto = new PaymentTrackerDTO();

        // TOTAL BILLED — Gross Accounts Receivable actually issued to advertisers.
        // Sum of InvoiceAmount for every invoice EXCEPT status = DRAFT.
        // A DRAFT invoice has been created internally but never sent to the
        // advertiser — no obligation to pay exists yet, so it isn't "billed"
        // in the accounting sense. The moment status moves to ISSUED, it
        // becomes a real receivable and enters this total.
        dto.setTotalBilled(summary.getTotalBilled());

        // COLLECTED — Realized Receivables (cash actually received).
        // Sum of InvoiceAmount where status = PAID. The only bucket here
        // representing money that has physically landed, not just an
        // obligation to pay.
        dto.setCollected(summary.getCollected());

        // OUTSTANDING — Current Receivables (billed, unpaid, still within terms).
        // Sum of InvoiceAmount where status = ISSUED: the advertiser owes this,
        // but it hasn't crossed into "late" yet.
        // NOTE: totalBilled = outstanding + collected + overdue + disputedAmount.
        // DISPUTED invoices are a separate bucket (see below) — they are
        // neither "current" nor "overdue," they're held pending resolution.
        dto.setOutstanding(summary.getOutstanding());

        // OVERDUE — Past-Due Receivables / delinquent AR.
        // Sum of InvoiceAmount where status = OVERDUE. This is the amount
        // genuinely at risk of becoming bad debt, and drives AR-aging
        // (30/60/90+ day) reporting.
        dto.setOverdue(summary.getOverdue());

        // PAID COUNT — volume of fully settled invoices, alongside the
        // "collected" dollar figure.
        dto.setPaidCount(summary.getPaidCount().intValue());

        // OVERDUE COUNT — how many individual invoices are currently late.
        // Distinct from the overdue dollar total: 3 overdue invoices worth
        // 60,200 tells a different collections story than 30 tiny ones.
        dto.setOverdueCount(summary.getOverdueCount().intValue());

        // DISPUTED COUNT — invoices formally contested by the advertiser
        // (billing error, rate mismatch, under-delivery claim, etc).
        // DISPUTED is its own status value here — mutually exclusive with
        // ISSUED/OVERDUE/PAID. While an invoice sits in DISPUTED, it is
        // NOT counted in outstanding or overdue above, even though it is
        // still technically part of totalBilled. Someone must resolve the
        // dispute and move status back to ISSUED/OVERDUE/PAID manually.
        dto.setDisputedCount(summary.getDisputedCount().intValue());

        return dto;
    }


    public PaymentSummaryResponse paymentSummary(Long advertiserId) {

        BigDecimal billed =
                repository.sumNetBillableByAdvertiser(advertiserId);

        BigDecimal paid =
                repository.sumNetBillableByAdvertiserAndStatus(
                        advertiserId,
                        ClientInvoiceStatus.PAID);

        BigDecimal issued =
                repository.sumNetBillableByAdvertiserAndStatus(
                        advertiserId,
                        ClientInvoiceStatus.ISSUED);

        BigDecimal overdue =
                repository.sumNetBillableByAdvertiserAndStatus(
                        advertiserId,
                        ClientInvoiceStatus.OVERDUE);

        BigDecimal outstanding = issued.add(overdue);

        return new PaymentSummaryResponse(
                advertiserId,
                billed,
                paid,
                outstanding,
                overdue);
    }

    // ---- billing calendar ----------------------------------------------------

    /** Invoices issued within the given month, e.g. month = "2026-05". */
    public List<BillingCalendarEntryResponse> calendar(YearMonth month) {

        LocalDate start = month.atDay(1);
        LocalDate end = month.atEndOfMonth();

        return repository.findByIssuedDateBetween(start, end)
                .stream()
                .map(BillingCalendarEntryResponse::from)
                .toList();
    }

    // ---- helpers -------------------------------------------------------------

    /** Returns [agencyCommission, netBillable]. */
    private BigDecimal[] computeCommercials(
            BigDecimal invoiceAmount,
            BigDecimal commissionRate) {

        BigDecimal rate =
                (commissionRate == null)
                        ? DEFAULT_COMMISSION_RATE
                        : commissionRate;

        BigDecimal commission = invoiceAmount
                .multiply(rate)
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal netBillable = invoiceAmount
                .add(commission)
                .setScale(2, RoundingMode.HALF_UP);

        return new BigDecimal[]{commission, netBillable};
    }

    private ClientInvoiceStatus parseStatus(String raw) {
        try {
            return ClientInvoiceStatus.valueOf(
                    raw.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BillingRuleException(
                    "Unknown client invoice status: " + raw);
        }
    }
}