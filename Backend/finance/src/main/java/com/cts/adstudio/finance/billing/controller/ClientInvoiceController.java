package com.cts.adstudio.finance.billing.controller;

import com.cts.adstudio.finance.billing.dto.*;
import com.cts.adstudio.finance.billing.enums.ClientInvoiceStatus;
import com.cts.adstudio.finance.billing.service.ClientInvoiceService;
import com.cts.adstudio.finance.shared.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Finance Dashboard — client billing.
 *
 * RBAC (Backend Plan §9): Finance + Admin have full access; AdvertiserBrand is
 * read-only. Roles map to ROLE_FINANCE / ROLE_ADMIN / ROLE_ADVERTISER_BRAND
 * authorities (set by Dev 1's JwtTokenProvider / UserDetailsService).
 *
 * actingUserId is taken from the X-User-Id header as a seam for audit logging;
 * in the integrated app, resolve it from the JWT principal (SecurityContext).
 */
@Slf4j
@RestController
@RequestMapping("/api/client-invoices")
@RequiredArgsConstructor
public class ClientInvoiceController {

    private final ClientInvoiceService service;

    @PostMapping//create() → manual invoice creation
    @ResponseStatus(HttpStatus.CREATED)

    public ApiResponse<ClientInvoiceResponse> create(
            @Valid @RequestBody CreateClientInvoiceRequest req,
            @RequestHeader(value = "Acting-User-Id-Finance", required = false) Long actingUserId) {
        log.info("Received CreateClientInvoiceRequest: {}", req);
        return ApiResponse.ok(service.create(req, actingUserId), "Client invoice created");
    }

    @PostMapping("/generate")// generate() → auto-generate invoice from delivery data
    @ResponseStatus(HttpStatus.CREATED)

    public ApiResponse<ClientInvoiceResponse> generate(
            @Valid @RequestBody GenerateClientInvoiceRequest req,
            @RequestHeader(value = "X-User-Id", required = false) Long actingUserId) {
        return ApiResponse.ok(service.generate(req, actingUserId),
                "Client invoice generated from delivery");
    }

    @GetMapping("/{id}")
    public ApiResponse<ClientInvoiceResponse> get(@PathVariable Long id) {
        return ApiResponse.ok(service.get(id));
    }

    @GetMapping
    public ApiResponse<List<ClientInvoiceResponse>> list(
            @RequestParam(required = false) ClientInvoiceStatus status, // ClientInvoiceStatus - enum
            @PageableDefault(size = 20) Pageable pageable) {
        return ApiResponse.page(service.list(status, pageable), "Client invoices");
    }

    @PutMapping("/{id}")
    public ApiResponse<ClientInvoiceResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateClientInvoiceRequest req,
            @RequestHeader(value = "X-User-Id", required = false) Long actingUserId) {
        return ApiResponse.ok(service.update(id, req, actingUserId), "Client invoice updated");
    }

    @PutMapping("/{id}/status")
    public ApiResponse<ClientInvoiceResponse> changeStatus(
            @PathVariable Long id,
            @Valid @RequestBody ChangeStatusRequest req,
            @RequestHeader(value = "X-User-Id", required = false) Long actingUserId) {
        return ApiResponse.ok(service.changeStatus(id, req.status(), actingUserId),
                "Client invoice status updated");
    }

    @GetMapping("/summary")
    public ApiResponse<PaymentSummaryResponse> paymentSummary(@RequestParam Long advertiserId) {
        return ApiResponse.ok(service.paymentSummary(advertiserId), "Payment summary");
    }
    @GetMapping("/payment-tracker")
    public ApiResponse<PaymentTrackerDTO> getPaymentTracker() {
        return ApiResponse.ok(service.getPaymentTracker(), "Payment tracker");
    }
}
