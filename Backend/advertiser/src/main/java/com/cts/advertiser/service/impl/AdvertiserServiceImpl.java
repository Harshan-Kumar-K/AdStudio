package com.cts.advertiser.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import com.cts.advertiser.shared.NotificationClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cts.advertiser.dto.request.AdvertiserRequest;
import com.cts.advertiser.dto.response.AdvertiserResponse;
import com.cts.advertiser.entity.Advertiser;
import com.cts.advertiser.exception.ResourceNotFoundException;
import com.cts.advertiser.repository.AdvertiserRepository;
import com.cts.advertiser.service.AdvertiserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdvertiserServiceImpl implements AdvertiserService {
    
    // Injected automatically by Spring via @RequiredArgsConstructor
    private final AdvertiserRepository advertiserRepository;
    private final NotificationClient notificationClient;

    // Converts request DTO to entity and saves to database
    @Override
    @Transactional
    public AdvertiserResponse createAdvertiser(AdvertiserRequest request) {
        Advertiser advertiser = Advertiser.builder()
            .companyName(request.getCompanyName())
            .industry(request.getIndustry())
            .accountManagerId(request.getAccountManagerId())
            .annualBudget(request.getAnnualBudget())
            .currency(request.getCurrency())
            .build();

        Advertiser saved = advertiserRepository.save(advertiser);

        notificationClient.notify(saved.getAccountManagerId(),
                "Advertiser " + saved.getCompanyName() + " (#" + saved.getAdvertiserId() + ") was created.",
                "Advertiser");

        return mapToResponse(saved);
    }

    // Retrieves all advertisers and maps them to response DTOs
    @Override
    public List<AdvertiserResponse> getAllAdvertiser() {
        return advertiserRepository.findAll()
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    // Finds advertiser by ID or throws exception if not found
    @Override
    public AdvertiserResponse getAdvertiserById(Integer id) {
        Advertiser advertiser = advertiserRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Advertiser not found with ID: " + id));

        return mapToResponse(advertiser);
    }

    // Updates existing advertiser fields and saves changes
    @Override
    @Transactional
    public AdvertiserResponse updateAdvertiser(Integer id, AdvertiserRequest request) {
        Advertiser advertiser = advertiserRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Advertiser not found with ID: " + id));

        advertiser.setCompanyName(request.getCompanyName());
        advertiser.setIndustry(request.getIndustry());
        advertiser.setAccountManagerId(request.getAccountManagerId());
        advertiser.setAnnualBudget(request.getAnnualBudget());
        advertiser.setCurrency(request.getCurrency());

        Advertiser updated = advertiserRepository.save(advertiser);

        notificationClient.notify(updated.getAccountManagerId(),
                "Advertiser #" + id + " details were updated.",
                "Advertiser");

        return mapToResponse(updated);

    }

    // Deletes advertiser by ID or throws exception if not found
    @Override
    @Transactional
    public void deleteAdvertiser(Integer id) {
        Advertiser advertiser = advertiserRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Advertiser not found with ID: " + id));

        advertiserRepository.deleteById(id);

        notificationClient.notify(advertiser.getAccountManagerId(),
                "Advertiser #" + id + " was deleted.",
                "Advertiser");
    }

    // Maps entity fields to response DTO
    private AdvertiserResponse mapToResponse(Advertiser advertiser) {
        AdvertiserResponse response = new AdvertiserResponse();

        response.setAdvertiserId(advertiser.getAdvertiserId());
        response.setCompanyName(advertiser.getCompanyName());
        response.setIndustry(advertiser.getIndustry());
        response.setAccountManagerId(advertiser.getAccountManagerId());
        response.setAnnualBudget(advertiser.getAnnualBudget());
        response.setCurrency(advertiser.getCurrency());
        response.setStatus(advertiser.getStatus() != null ? advertiser.getStatus().name() : null);
        response.setCreatedAt(advertiser.getCreatedAt());
        response.setUpdatedAt(advertiser.getUpdatedAt());

        return response;

    }

}
