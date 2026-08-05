package com.cts.advertiser.service.impl;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import com.cts.advertiser.entity.Advertiser;
import com.cts.advertiser.entity.Brand;
import com.cts.advertiser.repository.BrandRepository;
import com.cts.advertiser.shared.NotificationClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cts.advertiser.dto.request.CampaignBriefRequest;
import com.cts.advertiser.dto.response.CampaignBriefResponse;
import com.cts.advertiser.entity.CampaignBrief;
import com.cts.advertiser.exception.ResourceNotFoundException;
import com.cts.advertiser.repository.CampaignBriefRepository;
import com.cts.advertiser.service.CampaignBriefService;
import com.cts.advertiser.shared.StatusTransitionValidator;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CampaignBriefServiceImpl implements CampaignBriefService {

    // Injected automatically by Spring via @RequiredArgsConstructor
    private final CampaignBriefRepository campaignBriefRepository;
    private final StatusTransitionValidator statusTransitionValidator;
    private final NotificationClient notificationClient;
    private final BrandRepository brandRepository;

    // Converts request DTO to entity and saves to database
    @Override
    @Transactional
    public CampaignBriefResponse createCampaignBrief(CampaignBriefRequest request) {
        validateBudgetHeadroom(request.getBrandId(), request.getTotalBudget());

        CampaignBrief brief = CampaignBrief.builder()
            .brandId(request.getBrandId())
            .campaignName(request.getCampaignName())
            .objective(request.getObjective() != null ? CampaignBrief.CampaignObjective.valueOf(request.getObjective()) : null)
            .startDate(request.getStartDate())
            .endDate(request.getEndDate())
            .totalBudget(request.getTotalBudget())
            .channelPreferences(request.getChannelPreferences())
            .submittedById(request.getSubmittedById())
            .build();

        CampaignBrief saved = campaignBriefRepository.save(brief);

        notificationClient.notify(saved.getSubmittedById(),
                "Campaign Brief " + saved.getCampaignName() + " (#" + saved.getBriefId() + ") was created.",
                "Brief");

        return mapToResponse(saved);
        
    }
 
    // Retrieves all campaign briefs and maps them to response DTOs
    @Override
    public List<CampaignBriefResponse> getAllCampaignBriefs() {
        return campaignBriefRepository.findAll()
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    // Finds campaign brief by ID or throws exception if not found
    @Override
    public CampaignBriefResponse getCampaignBriefById(Integer id) {

        CampaignBrief brief = campaignBriefRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Campaign brief not found with ID: " + id));

        return mapToResponse(brief);

    }

    // Returns all campaign briefs belonging to a specific brand
    @Override
    public List<CampaignBriefResponse> getAllBriefsByBrandId(Integer brandId) {
        
        return campaignBriefRepository.findByBrandId(brandId)
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
        
    }

    // Updates existing campaign brief fields and saves changes
    @Override
    @Transactional
    public CampaignBriefResponse updateCampaignBrief(Integer id, CampaignBriefRequest request) {
        
        CampaignBrief brief = campaignBriefRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Campaign Brief not found with ID: " + id));

        brief.setCampaignName(request.getCampaignName());
        brief.setObjective(request.getObjective() != null ? CampaignBrief.CampaignObjective.valueOf(request.getObjective()) : null);
        brief.setStartDate(request.getStartDate());
        brief.setEndDate(request.getEndDate());
        brief.setTotalBudget(request.getTotalBudget());
        brief.setChannelPreferences(request.getChannelPreferences());

        CampaignBrief updated = campaignBriefRepository.save(brief);

        notificationClient.notify(updated.getSubmittedById(),
                "Campaign Brief #" + id + " details were updated.",
                "Brief");

        return mapToResponse(updated);

    }

    // Updates only the status of a campaign brief
    @Override
    @Transactional
    public CampaignBriefResponse updateCampaignBriefStatus(Integer id, String status) {
        
        CampaignBrief brief = campaignBriefRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Campaign Brief not found with ID: " + id));

        CampaignBrief.CampaignStatus targetStatus = CampaignBrief.CampaignStatus.valueOf(status);

        // Validates the transition is allowed before applying it
        statusTransitionValidator.validate(brief.getStatus(), targetStatus);

        brief.setStatus(targetStatus);

        CampaignBrief updated = campaignBriefRepository.save(brief);

        notificationClient.notify(updated.getSubmittedById(),
                "Campaign Brief #" + id + " status changed to " + status + ".",
                "Brief");

        return mapToResponse(updated);
        
    }

    // Deletes campaign brief by ID or throws exception if not found
    @Override
    @Transactional
    public void deleteCampaignBrief(Integer id) {
        CampaignBrief brief = campaignBriefRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign Brief not found with ID: " + id));

        campaignBriefRepository.deleteById(id);

        notificationClient.notify(brief.getSubmittedById(),
                "Campaign Brief #" + id + " was deleted.",
                "Brief");
    }

    // Validates that the requested budget does not exceed advertiser's remaining budget headroom
    private void validateBudgetHeadroom(Integer brandId, BigDecimal campaignTotalBudget) {

        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with ID: " + brandId));

        if(brand.getAllocatedBudget() == null) return;
        if(campaignTotalBudget == null) return;

        BigDecimal alreadyAllocated;

//        if(excludeBrandId != null) alreadyAllocated = brandRepository.sumAllocatedBudgetByAdvertiserExcludingBrand(advertiserId, excludeBrandId);
         alreadyAllocated = brand.getSpentToDate() != null ? brand.getSpentToDate() : BigDecimal.ZERO;

        BigDecimal remainingBudget = brand.getAllocatedBudget().subtract(alreadyAllocated);

        if(campaignTotalBudget.compareTo(remainingBudget) > 0) {
            throw new IllegalArgumentException(String.format("Insufficient budget headroom. Requested: %s, Available: %s (Annual: %s, Already allocated: %s", campaignTotalBudget, remainingBudget, brand.getAllocatedBudget(), alreadyAllocated));
        }

        // update brand with new spendtoDate.
        brand.setSpentToDate(alreadyAllocated.add(campaignTotalBudget));
        brandRepository.save(brand);

    }

    private CampaignBriefResponse mapToResponse(CampaignBrief brief) {

        CampaignBriefResponse response = new CampaignBriefResponse();

        response.setBriefId(brief.getBriefId());
        response.setBrandId(brief.getBrandId());
        response.setCampaignName(brief.getCampaignName());
        response.setObjective(brief.getObjective() != null ? brief.getObjective().name() : null);
        response.setStartDate(brief.getStartDate());
        response.setEndDate(brief.getEndDate());
        response.setTotalBudget(brief.getTotalBudget());
        response.setChannelPreference(brief.getChannelPreferences());
        response.setSubmittedById(brief.getSubmittedById());
        response.setStatus(brief.getStatus() != null ? brief.getStatus().name() : null);
        response.setCreatedAt(brief.getCreatedAt());
        response.setUpdatedAt(brief.getUpdatedAt());

        return response;

    }
    
}
