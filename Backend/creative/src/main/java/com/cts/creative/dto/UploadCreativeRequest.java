package com.cts.creative.dto;

import com.cts.creative.entity.CreativeAsset;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.bind.annotation.BindParam;

/**
 * Multipart form fields for asset upload (the file itself is bound
 * separately in the controller via @RequestParam("file") MultipartFile).
 *
 * Requires Spring Framework 6.1+ / Spring Boot 3.2+ for @ModelAttribute
 * constructor binding on records.
 *
 * @BindParam names are set explicitly so binding works even if the
 * project is compiled without the -parameters javac flag (without it,
 * Spring cannot recover record constructor-parameter names via
 * reflection, and every field silently binds to null).
 */
public record UploadCreativeRequest(

        @BindParam("brandId")
        @NotNull(message = "Brand Id is required")
        Long brandId,

        @BindParam("campaignBriefId")
        @NotNull(message = "Campaign Brief Id is required")
        Long campaignBriefId,

        @BindParam("assetName")
        @NotBlank(message = "Asset Name is required")
        String assetName,

        @BindParam("uploadedById")
        @NotNull(message = "Uploaded By Id is required")
        Long uploadedById,

        @BindParam("assetType")
        @NotNull(message = "Asset Type is required")
        CreativeAsset.AssetType assetType,

        @BindParam("width")
        @NotNull(message = "Width is required")
        Integer width,

        @BindParam("height")
        @NotNull(message = "Height is required")
        Integer height
) {
}