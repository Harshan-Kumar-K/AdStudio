package com.cts.advertiser.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import com.cts.advertiser.repository.CampaignBriefRepository;
import com.cts.advertiser.shared.NotificationClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cts.advertiser.dto.request.TargetAudienceRequest;
import com.cts.advertiser.dto.response.TargetAudienceResponse;
import com.cts.advertiser.entity.TargetAudience;
import com.cts.advertiser.exception.ResourceNotFoundException;
import com.cts.advertiser.repository.TargetAudienceRepository;
import com.cts.advertiser.service.TargetAudienceService;
import com.cts.advertiser.entity.CampaignBrief;
import com.cts.advertiser.repository.CampaignBriefRepository;
import com.cts.advertiser.shared.NotificationClient;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TargetAudienceServiceImpl implements TargetAudienceService {

    // Injected automatically by Spring via @RequiredArgsConstructor
    private final TargetAudienceRepository targetAudienceRepository;
    private final CampaignBriefRepository campaignBriefRepository;
    private final NotificationClient notificationClient;

    // Converts request DTO to entity and saves to database
    @Override
    @Transactional
    public TargetAudienceResponse createTargetAudience(TargetAudienceRequest request) {
        
        TargetAudience audience = TargetAudience.builder()
            .briefId(request.getBriefId())
            .ageRange(request.getAgeRange())
            .gender(request.getGender())
            .interests(request.getInterests())
            .geography(request.getGeography())
            .deviceType(request.getDeviceType() != null ? TargetAudience.DeviceType.valueOf(request.getDeviceType()) : null)
            .build();

        TargetAudience saved = targetAudienceRepository.save(audience);

        campaignBriefRepository.findById(saved.getBriefId()).ifPresent(brief ->
                notificationClient.notify(brief.getSubmittedById(),
                        "A target audience was added to campaign brief #" + saved.getBriefId() + ".",
                        "Brief"));

        return mapToResponse(saved);

    }

    // Retrieves all target audience records and maps them to response DTOs
    @Override
    public List<TargetAudienceResponse> getAllTargetAudiences() {
        
        return targetAudienceRepository.findAll()
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());

    }

    // Finds target audience by ID or throws exception if not found
    @Override
    public TargetAudienceResponse getTargetAudienceById(Integer id) {
        
        TargetAudience audience = targetAudienceRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Target audience not found with ID: " + id));

        return mapToResponse(audience);

    }

    // Returns all audience records belonging to a specific campaign brief
    @Override
    public List<TargetAudienceResponse> getAllAudiencesByBriefId(Integer briefId) {
        
        return targetAudienceRepository.findByBriefId(briefId)
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    
    }

    // Update existing target audience fields and saves changes
    @Override
    @Transactional
    public TargetAudienceResponse updateTargetAudience(Integer id, TargetAudienceRequest request) {
        
        TargetAudience audience = targetAudienceRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Target audience not found with ID: " + id));

        audience.setAgeRange(request.getAgeRange());
        audience.setGender(request.getGender());
        audience.setInterests(request.getInterests());
        audience.setGeography(request.getGeography());
        audience.setDeviceType(request.getDeviceType() != null ? TargetAudience.DeviceType.valueOf(request.getDeviceType()) : null);

        TargetAudience updated = targetAudienceRepository.save(audience);

        campaignBriefRepository.findById(updated.getBriefId()).ifPresent(brief ->
                notificationClient.notify(brief.getSubmittedById(),
                        "Target Audience #" + id + " was updated.",
                        "Brief"));

        return mapToResponse(updated);
        
    }

    // Deltes target audience by ID or throws exception if not found
    @Override
    @Transactional
    public void deleteTargetAudience(Integer id) {
        TargetAudience audience = targetAudienceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Target audience not found with ID: " + id));

        targetAudienceRepository.deleteById(id);

        campaignBriefRepository.findById(audience.getBriefId()).ifPresent(brief ->
                notificationClient.notify(brief.getSubmittedById(),
                        "Target Audience #" + id + " was deleted.",
                        "Brief"));
    }

        // Maps entity fields to response DTO
    private TargetAudienceResponse mapToResponse(TargetAudience audience) {

        TargetAudienceResponse response = new TargetAudienceResponse();

        response.setAudienceId(audience.getAudienceId());
        response.setBriefId(audience.getBriefId());
        response.setAgeRange(audience.getAgeRange());
        response.setGender(audience.getGender());
        response.setInterests(audience.getInterests());
        response.setGeography(audience.getGeography());
        response.setDeviceType(audience.getDeviceType() != null ? audience.getDeviceType().name() : null);
        response.setStatus(audience.getStatus() != null ? audience.getStatus().name() : null);
        response.setCreatedAt(audience.getCreatedAt());
        response.setUpdatedAt(audience.getUpdatedAt());

        return response;

    }
    
}
