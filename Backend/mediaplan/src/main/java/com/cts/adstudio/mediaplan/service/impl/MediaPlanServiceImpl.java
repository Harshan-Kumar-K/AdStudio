package com.cts.adstudio.mediaplan.service.impl;

import com.cts.adstudio.mediaplan.dto.request.MediaPlanRequest;
import com.cts.adstudio.mediaplan.dto.response.MediaPlanResponse;
import com.cts.adstudio.mediaplan.entity.MediaPlan;
import com.cts.adstudio.mediaplan.exception.ResourceNotFoundException;
import com.cts.adstudio.mediaplan.repository.MediaPlanRepository;
import com.cts.adstudio.mediaplan.service.MediaPlanService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import com.cts.adstudio.mediaplan.shared.PagedResponse;
import com.cts.adstudio.mediaplan.shared.PaginationHelper;
import org.springframework.data.domain.Pageable;
import com.cts.adstudio.mediaplan.shared.StatusTransitionValidator;
import com.cts.adstudio.mediaplan.shared.NotificationClient;

@Service
@RequiredArgsConstructor
@Slf4j
public class MediaPlanServiceImpl implements MediaPlanService {

    private final MediaPlanRepository mediaPlanRepository;
    private final StatusTransitionValidator statusValidator;
    private final NotificationClient notificationClient;

    @Override
    public MediaPlanResponse createMediaPlan(MediaPlanRequest request) {
        log.info("Creating media plan for brief ID: {}", request.getBriefId());

        MediaPlan plan = MediaPlan.builder()
                .briefId(request.getBriefId())
                .plannerId(request.getPlannerId())
                .totalBudgetAllocated(request.getTotalBudgetAllocated())
                .channelMix(request.getChannelMix())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .status(MediaPlan.MediaPlanStatus.Draft)
                .build();

        MediaPlan saved = mediaPlanRepository.save(plan);
        log.info("Media plan created with ID: {}", saved.getPlanId());

        notificationClient.notify(saved.getPlannerId(),
                "Media Plan #" + saved.getPlanId() + " was created and set to Draft.",
                "MediaPlan");

        return mapToResponse(saved);
    }

    @Override
    public MediaPlanResponse getMediaPlanById(Integer planId) {
        MediaPlan plan = mediaPlanRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Media Plan not found with ID: " + planId));
        return mapToResponse(plan);
    }

    @Override //paginated response of media plans
    public PagedResponse<MediaPlanResponse> getAllMediaPlans(Pageable pageable) {
        return PaginationHelper.toPagedResponse(
                mediaPlanRepository.findAll(pageable),
                this::mapToResponse);
    }

    @Override
    public MediaPlanResponse updateMediaPlan(Integer planId, MediaPlanRequest request) {
        MediaPlan plan = mediaPlanRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Media Plan not found with ID: " + planId));

        plan.setTotalBudgetAllocated(request.getTotalBudgetAllocated());
        plan.setChannelMix(request.getChannelMix());
        plan.setStartDate(request.getStartDate());
        plan.setEndDate(request.getEndDate());

        MediaPlan saved = mediaPlanRepository.save(plan);

        notificationClient.notify(saved.getPlannerId(),
                "Media Plan #" + planId + " was updated.",
                "MediaPlan");

        return mapToResponse(saved);
    }

    @Override
    public MediaPlanResponse updateMediaPlanStatus(Integer planId, String newStatus) {
        MediaPlan plan = mediaPlanRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Media Plan not found with ID: " + planId));

        MediaPlan.MediaPlanStatus status;
        try {
            status = MediaPlan.MediaPlanStatus.valueOf(newStatus);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + newStatus);
        }

        // enforce legal workflow transition (Draft -> PendingApproval -> ...)
        statusValidator.validatePlan(plan.getStatus(), status);

        plan.setStatus(status);
        MediaPlan saved = mediaPlanRepository.save(plan);
        log.info("Media Plan {} status updated to {}", planId, newStatus);

        notificationClient.notify(saved.getPlannerId(),
                "Media Plan #" + planId + " status changed to " + newStatus + ".",
                "MediaPlan");

        return mapToResponse(saved);
    }

    @Override
    public void deleteMediaPlan(Integer planId) {
        // Fetch (not just existsById) so we still have plannerId to notify after deletion.
        MediaPlan plan = mediaPlanRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Media Plan not found with ID: " + planId));

        mediaPlanRepository.deleteById(planId);

        notificationClient.notify(plan.getPlannerId(),
                "Media Plan #" + planId + " was deleted.",
                "MediaPlan");
    }

    private MediaPlanResponse mapToResponse(MediaPlan plan) {
        return MediaPlanResponse.builder()
                .planId(plan.getPlanId())
                .briefId(plan.getBriefId())
                .plannerId(plan.getPlannerId())
                .totalBudgetAllocated(plan.getTotalBudgetAllocated())
                .channelMix(plan.getChannelMix())
                .startDate(plan.getStartDate())
                .endDate(plan.getEndDate())
                .status(plan.getStatus() != null ? plan.getStatus().name() : null)
                .createdAt(plan.getCreatedAt())
                .updatedAt(plan.getUpdatedAt())
                .build();
    }
}