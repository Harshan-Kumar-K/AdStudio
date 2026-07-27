package com.cts.advertiser.dto.request;

import java.math.BigDecimal;

import com.cts.advertiser.shared.BrandStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BrandRequest {
    
    @NotNull(message = "Advertiser ID is required")
    private Integer advertiserId;

    @NotBlank(message = "Brand name is required")
    private String brandName;

    private String category;

    private BigDecimal allocatedBudget;

    private BrandStatus status;

    private BigDecimal spentToDate;

    private String color;

}
