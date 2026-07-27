package com.cts.creative.dto;

import com.cts.creative.entity.CreativeAsset;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.bind.annotation.BindParam;

/**
 * Multipart form fields for asset update. The (optional) replacement
 * file is bound separately in the controller.
 *
 * See UploadCreativeRequest for why @BindParam is needed.
 */
public record UpdateCreativeRequest(

        @BindParam("assetName")
        @NotBlank(message = "Asset Name is required")
        String assetName,

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