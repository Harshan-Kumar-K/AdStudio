package com.cts.creative.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssetLinkResponse {

    private Long linkId;

    private Long assetId;

    private String assetName;

    private Long lineItemId;

    private LocalDate linkedDate;

    private String status;
}