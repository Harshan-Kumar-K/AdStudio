package com.cts.creative.controller;

import java.time.LocalDateTime;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cts.creative.dto.ApiResponse;
import com.cts.creative.dto.ApprovalRequest;
import com.cts.creative.service.CreativeService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/creative-approvals")
@RequiredArgsConstructor
public class CreativeApprovalController {

    private final CreativeService service;

    @PutMapping("/{assetId}/decision")
    public ResponseEntity<ApiResponse<?>> approve(

            @PathVariable Long assetId,

            @Valid
            @RequestBody
            ApprovalRequest request) {

        log.info(
                "Approval request for asset {} with decision {}",
                assetId,
                request.decision());

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Creative approval processed successfully",
                        service.approveAsset(
                                assetId,
                                request),
                        LocalDateTime.now()
                )
        );
    }@GetMapping
public ResponseEntity<ApiResponse<?>> getAllApprovals() {

    log.info("Fetching all approvals");

    return ResponseEntity.ok(
            new ApiResponse<>(
                    true,
                    "Approvals fetched successfully",
                    service.getAllApprovals(),
                    LocalDateTime.now()
            )
    );
}
}