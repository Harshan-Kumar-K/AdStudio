package com.cts.advertiser.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import com.cts.advertiser.shared.NotificationClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cts.advertiser.dto.request.CampaignBriefApprovalRequest;
import com.cts.advertiser.dto.response.CampaignBriefApprovalResponse;
import com.cts.advertiser.dto.response.CampaignBriefResponse;
import com.cts.advertiser.entity.CampaignBrief;
import com.cts.advertiser.entity.CampaignBriefApproval;
import com.cts.advertiser.exception.ResourceNotFoundException;
import com.cts.advertiser.repository.CampaignBriefApprovalRepository;
import com.cts.advertiser.repository.CampaignBriefRepository;
import com.cts.advertiser.service.CampaignBriefApprovalService;
import com.cts.advertiser.shared.StatusTransitionValidator;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CampaignBriefApprovalServiceImpl implements CampaignBriefApprovalService {
    
    // Injected automatically by Spring
    private final CampaignBriefRepository campaignBriefRepository;
    private final CampaignBriefApprovalRepository campaignBriefApprovalRepository;
    private final StatusTransitionValidator statusTransitionValidator;
    private final NotificationClient notificationClient;

    // Submits a brief for approval - validates current status is Draft
    @Override
    @Transactional
    public CampaignBriefResponse submitForApproval(Integer briefId) {
        
        CampaignBrief brief = campaignBriefRepository.findById(briefId)
            .orElseThrow(() -> new ResourceNotFoundException("Campaign brief not found with ID: " + briefId));

        // Only Draft briefs can be submitted
        statusTransitionValidator.validate(brief.getStatus(), CampaignBrief.CampaignStatus.Submitted);

        brief.setStatus(CampaignBrief.CampaignStatus.Submitted);

        CampaignBrief updated = campaignBriefRepository.save(brief);

        notificationClient.notify(updated.getSubmittedById(),
                "Campaign Brief #" + briefId + " was submitted for approval.",
                "Brief");

        return mapBriefToResponse(updated);

    }

    // Records reviewer decision and updates brief status accordingly
    @Override
    @Transactional
    public CampaignBriefApprovalResponse makeDecision(Integer briefId, CampaignBriefApprovalRequest request) {
        
        CampaignBrief brief = campaignBriefRepository.findById(briefId)
            .orElseThrow(() -> new ResourceNotFoundException("Campaign brief not found with ID: " + briefId));

        // Convert string decision to enum
        CampaignBriefApproval.ApprovalDecision decision = CampaignBriefApproval.ApprovalDecision.valueOf(request.getDecision());

        // Only submitted briefs can be reviewed
        statusTransitionValidator.validate(brief.getStatus(), decision == CampaignBriefApproval.ApprovalDecision.Approved ? CampaignBrief.CampaignStatus.Approved : CampaignBrief.CampaignStatus.Rejected);


        // Update brief status based on decision
        if(decision == CampaignBriefApproval.ApprovalDecision.Approved) brief.setStatus(CampaignBrief.CampaignStatus.Approved);
        else if(decision == CampaignBriefApproval.ApprovalDecision.Rejected) brief.setStatus(CampaignBrief.CampaignStatus.Rejected);
        // RevisionRequired keeps status as Submitted for resubmission

        campaignBriefRepository.save(brief);

        // Save the approval record
        CampaignBriefApproval approval = CampaignBriefApproval.builder()
            .briefId(briefId)
            .reviewerId(request.getReviewerId())
            .decision(decision)
            .comments(request.getComments())
            .build();

        CampaignBriefApproval saved = campaignBriefApprovalRepository.save(approval);

        notificationClient.notify(brief.getSubmittedById(),
                "Campaign Brief #" + briefId + " was " + decision + ".",
                "Brief");

        return mapApprovalToResponse(saved);

    }

    // Activates an approved brief - validates current status is Approved
    @Override
    @Transactional
    public CampaignBriefResponse activateBrief(Integer briefId) {
        
        CampaignBrief brief = campaignBriefRepository.findById(briefId)
            .orElseThrow(() -> new ResourceNotFoundException("Campaign brief not found with ID: " + briefId));

        // Only Approved briefs can be activated
        statusTransitionValidator.validate(brief.getStatus(), CampaignBrief.CampaignStatus.Active);

        brief.setStatus(CampaignBrief.CampaignStatus.Active);

        CampaignBrief updated = campaignBriefRepository.save(brief);

        notificationClient.notify(updated.getSubmittedById(),
                "Campaign Brief #" + briefId + " was activated.",
                "Brief");

        return mapBriefToResponse(updated);
        
    }

    // Returns full approval history for a specific campaign brief
    @Override
    public List<CampaignBriefApprovalResponse> getApprovalHistory(Integer briefId) {
        
        // Verify the brief exists first
        if(!campaignBriefRepository.existsById(briefId)) throw new ResourceNotFoundException("Campaign brief not found with ID: " + briefId);

        return campaignBriefApprovalRepository.findByBriefId(briefId)
            .stream()
            .map(this::mapApprovalToResponse)
            .collect(Collectors.toList());

    }

    // Maps CampaignBrief entity to CampaignBriefResponse DTO
    private CampaignBriefResponse mapBriefToResponse(CampaignBrief brief) {

        CampaignBriefResponse response = new CampaignBriefResponse();

        response.setBriefId(brief.getBriefId());
        response.setBrandId(brief.getBrandId());
        response.setCampaignName(brief.getCampaignName());
        response.setObjective(brief.getObjective() != null ? brief.getObjective().name() : null);
        response.setTargetDemographic(brief.getTargetDemographic());
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

    // Maps CampaignBriefApproval entity to CampaignBriefApprovalResponse DTO
    private CampaignBriefApprovalResponse mapApprovalToResponse(CampaignBriefApproval approval) {

        CampaignBriefApprovalResponse response = new CampaignBriefApprovalResponse();

        response.setApprovalId(approval.getApprovalId());
        response.setBriefId(approval.getBriefId());
        response.setReviewerId(approval.getReviewerId());;
        response.setDecision(approval.getDecision() != null ? approval.getDecision().name() : null);
        response.setComments(approval.getComments());
        response.setReviewedAt(approval.getReviewedAt());
        response.setCreatedAt(approval.getCreatedAt());
        
        return response;

    }
    
}
