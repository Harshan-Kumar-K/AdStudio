package com.cts.advertiser.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CampaignBriefRequest {

    @NotNull(message = "Brand ID is required")
    private Integer brandId;

    @NotBlank(message = "Campaign name is required")
    private String campaignName;
    
    private String objective;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal totalBudget;
    private String channelPreferences;
    private Integer submittedById;
}