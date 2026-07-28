package com.cts.creative.controller;

import java.time.LocalDateTime;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cts.creative.dto.ApiResponse;
import com.cts.creative.dto.AssetLinkRequest;
import com.cts.creative.service.CreativeService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/asset-links")
@RequiredArgsConstructor
public class AssetLinkController {

    private final CreativeService service;

    @PostMapping
    public ResponseEntity<ApiResponse<?>> createLink(

            @Valid
            @RequestBody
            AssetLinkRequest request) {

        log.info(
                "Linking asset {} with line item {}",
                request.assetId(),
                request.lineItemId());

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Asset linked successfully",
                        service.linkAsset(request),
                        LocalDateTime.now()
                )
        );
    }
    @GetMapping
public ResponseEntity<ApiResponse<?>> getAllLinks() {

    log.info("Fetching all asset links");

    return ResponseEntity.ok(
            new ApiResponse<>(
                    true,
                    "Asset links fetched successfully",
                    service.getAllAssetLinks(),
                    LocalDateTime.now()
            )
    );
}
}