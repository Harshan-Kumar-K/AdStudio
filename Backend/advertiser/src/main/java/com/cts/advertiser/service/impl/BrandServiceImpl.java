package com.cts.advertiser.service.impl;

import java.util.List;
import java.util.stream.Collectors;
import java.math.BigDecimal;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cts.advertiser.dto.request.BrandRequest;
import com.cts.advertiser.dto.response.BrandResponse;
import com.cts.advertiser.entity.Advertiser;
import com.cts.advertiser.entity.Brand;
import com.cts.advertiser.exception.ResourceNotFoundException;
import com.cts.advertiser.repository.AdvertiserRepository;
import com.cts.advertiser.repository.BrandRepository;
import com.cts.advertiser.service.BrandService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BrandServiceImpl implements BrandService{
    
    // Inject automatically by Spring via @RequiredArgsConstructor
    private final BrandRepository brandRepository;
    private final AdvertiserRepository advertiserRepository;

    // Converts request DTO to entity and saves to database
    @Override
    @Transactional
    public BrandResponse createBrand(BrandRequest request) {

        validateBudgetHeadroom(request.getAdvertiserId(), request.getAllocatedBudget(), null);

        Brand brand = Brand.builder()
            .advertiserId(request.getAdvertiserId())
            .brandName(request.getBrandName())
            .category(request.getCategory())
            .color(request.getColor())
            .allocatedBudget(request.getAllocatedBudget())
            .build();

        Brand saved = brandRepository.save(brand);

        return mapToResponse(saved);

    }

    // Retrieves all brands and maps them to response DTOs
    @Override
    public List<BrandResponse> getAllBrands() {
        return brandRepository.findAll()
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    // Finds brand by ID or throws exception if not found
    @Override
    public BrandResponse getBrandById(Integer id) {
        
        Brand brand = brandRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Brand not found with ID: " + id));

        return mapToResponse(brand);

    }

    // Returns all brands belonging to a specific advertiser
    @Override
    public List<BrandResponse> getAllBrandsByAdvertiserId(Integer advertiserId) {
        
        return brandRepository.findByAdvertiserId(advertiserId)
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());

    }

    // Updates existing brand fields and saves changes
    @Override
    @Transactional
    public BrandResponse updateBrand(Integer id, BrandRequest request) {
        
        Brand brand = brandRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Brand not found with ID: " + id));

        validateBudgetHeadroom(brand.getAdvertiserId(), request.getAllocatedBudget(), id);

        brand.setBrandName(request.getBrandName());
        brand.setCategory(request.getCategory());
        brand.setAllocatedBudget(request.getAllocatedBudget());
        brand.setColor(request.getColor());

        Brand updated = brandRepository.save(brand);

        return mapToResponse(updated);

    }

    // Deletes branch by ID or throws exception if not found
    @Override
    @Transactional
    public void deleteBrand(Integer id) {
        
        if(!brandRepository.existsById(id)) throw new ResourceNotFoundException("Brand not found with ID: " + id);

        brandRepository.deleteById(id);
        
    }

    // Validates that the requested budget does not exceed advertiser's remaining budget headroom
    private void validateBudgetHeadroom(Integer advertiserId, BigDecimal requestedBudget, Integer excludeBrandId) {

        Advertiser advertiser = advertiserRepository.findById(advertiserId)
            .orElseThrow(() -> new ResourceNotFoundException("Advertiser not found with ID: " + advertiserId));

        if(advertiser.getAnnualBudget() == null) return;
        if(requestedBudget == null) return;

        BigDecimal alreadyAllocated;

        if(excludeBrandId != null) alreadyAllocated = brandRepository.sumAllocatedBudgetByAdvertiserExcludingBrand(advertiserId, excludeBrandId);
        else alreadyAllocated = brandRepository.sumAllocatedBudgetByAdvertiserId(advertiserId);

        BigDecimal remainingBudget = advertiser.getAnnualBudget().subtract(alreadyAllocated);

        if(requestedBudget.compareTo(remainingBudget) > 0) {
            throw new IllegalArgumentException(String.format("Insufficient budget headroom. Requested: %s, Available: %s (Annual: %s, Already allocated: %s", requestedBudget, remainingBudget, advertiser.getAnnualBudget(), alreadyAllocated));
        }

    }

    // Maps entity fields to response DTO
    private BrandResponse mapToResponse(Brand brand) {

        BrandResponse response = new BrandResponse();

        response.setBrandId(brand.getBrandId());
        response.setAdvertiserId(brand.getAdvertiserId());
        response.setBrandName(brand.getBrandName());
        response.setCategory(brand.getCategory());
        response.setAllocatedBudget(brand.getAllocatedBudget());
        response.setSpentToDate(brand.getSpentToDate());
        response.setStatus(brand.getStatus() != null ? brand.getStatus().name() : null);
        response.setCreatedAt(brand.getCreatedAt());
        response.setUpdatedAt(brand.getUpdatedAt());
        response.setColor(brand.getColor());

        return response;

    }

}
