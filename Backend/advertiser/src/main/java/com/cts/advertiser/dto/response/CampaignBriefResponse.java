package com.cts.advertiser.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.math.BigDecimal;

import lombok.Data;

@Data
public class CampaignBriefResponse {
    
    private Integer briefId;
    private Integer brandId;
    private String campaignName;
    private String objective;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal totalBudget;
    private String channelPreference;
    private Integer submittedById;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
