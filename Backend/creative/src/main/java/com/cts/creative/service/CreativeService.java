package com.cts.creative.service;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.cts.creative.creativeexception.CreativeNotFoundException;
import com.cts.creative.dto.ApprovalRequest;
import com.cts.creative.dto.ApprovalResponse;
import com.cts.creative.dto.AssetLinkRequest;
import com.cts.creative.dto.AssetLinkResponse;
import com.cts.creative.dto.UpdateCreativeRequest;
import com.cts.creative.dto.UploadCreativeRequest;
import com.cts.creative.entity.AssetLineItemLink;
import com.cts.creative.entity.CreativeApproval;
import com.cts.creative.entity.CreativeAsset;
import com.cts.creative.repository.AssetLineItemLinkRepository;
import com.cts.creative.repository.CreativeApprovalRepository;
import com.cts.creative.repository.CreativeAssetRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class CreativeService {

    private final CreativeAssetRepository assetRepo;
    private final CreativeApprovalRepository approvalRepo;
    private final AssetLineItemLinkRepository linkRepo;

    public CreativeAsset upload(
            MultipartFile file,
            UploadCreativeRequest request
    ) throws Exception {

        if (file == null || file.isEmpty()) {
            throw new RuntimeException(
                    "File cannot be empty");
        }

        log.info(
                "Uploading asset {}",
                request.assetName());

        var uploadDir = Paths.get(
                System.getProperty("user.dir"),
                "uploads"
        );

        Files.createDirectories(uploadDir);

        log.info(
                "Project Root Directory : {}",
                System.getProperty("user.dir"));

        log.info(
                "Upload Directory : {}",
                uploadDir.toAbsolutePath());

        var fileName =
                System.currentTimeMillis()
                        + "_"
                        + file.getOriginalFilename()
                                .replaceAll("\\s+", "_");

        var filePath =
                uploadDir.resolve(fileName);

        file.transferTo(filePath.toFile());

        var asset =
                CreativeAsset.builder()
                        .brandId(request.brandId())
                        .campaignBriefId(request.campaignBriefId())
                        .assetName(request.assetName())
                        .uploadedById(request.uploadedById())
                        .assetType(request.assetType())
                        .width(request.width())
                        .height(request.height())
                        .filePath(filePath.toString())
                        .fileSizeKB(
                                (int) (file.getSize() / 1024))
                        .version(1)
                        .status(
                                CreativeAsset.Status.DRAFT)
                        .build();

        log.info(
                "Asset uploaded successfully : {}",
                request.assetName());

        return assetRepo.save(asset);
    }

    public List<CreativeAsset> getAllAssets() {

        log.info(
                "Fetching all assets");

        return assetRepo.findAll();
    }

    public CreativeAsset getAsset(
            Long assetId) {

        log.info(
                "Fetching asset with id {}",
                assetId);

        return assetRepo.findById(assetId)
                .orElseThrow(() ->
                        new CreativeNotFoundException(
                                "Asset Not Found"));
    }

    public CreativeAsset updateAsset(
            Long assetId,
            MultipartFile file,
            UpdateCreativeRequest request
    ) throws Exception {

        log.info(
                "Updating asset {}",
                assetId);

        var asset =
                assetRepo.findById(assetId)
                        .orElseThrow(() ->
                                new CreativeNotFoundException(
                                        "Asset Not Found"));

        asset.setAssetName(request.assetName());
        asset.setAssetType(request.assetType());
        asset.setWidth(request.width());
        asset.setHeight(request.height());

        if (file != null && !file.isEmpty()) {

            if (asset.getFilePath() != null) {

                var oldFile =
                        Paths.get(
                                asset.getFilePath());

                Files.deleteIfExists(oldFile);
            }

            var uploadDir = Paths.get(
                    System.getProperty("user.dir"),
                    "uploads"
            );

            Files.createDirectories(uploadDir);

            log.info(
                    "Upload Directory : {}",
                    uploadDir.toAbsolutePath());

            var fileName =
                    System.currentTimeMillis()
                            + "_"
                            + file.getOriginalFilename()
                                    .replaceAll("\\s+", "_");

            var filePath =
                    uploadDir.resolve(fileName);

            file.transferTo(filePath.toFile());

            asset.setFilePath(
                    filePath.toString());

            asset.setFileSizeKB(
                    (int) (file.getSize() / 1024));

            asset.setVersion(
                    asset.getVersion() + 1);

            log.info(
                    "Asset file updated for asset {}",
                    assetId);
        }

        return assetRepo.save(asset);
    }

    public void deleteAsset(
            Long assetId) {

        log.info(
                "Deleting asset {}",
                assetId);

        var asset =
                assetRepo.findById(assetId)
                        .orElseThrow(() ->
                                new CreativeNotFoundException(
                                        "Asset Not Found"));

        if (!asset.getLinks().isEmpty()) {

            throw new RuntimeException(
                    "Asset is linked with line items and cannot be deleted");
        }

        assetRepo.delete(asset);

        log.info(
                "Asset deleted {}",
                assetId);
    }

    public CreativeApproval approveAsset(
            Long assetId,
            ApprovalRequest request) {

        log.info(
                "Approval request received for asset {}",
                assetId);

        var asset =
                assetRepo.findById(assetId)
                        .orElseThrow(() ->
                                new CreativeNotFoundException(
                                        "Asset Not Found"));

        asset.setStatus(
                switch (
                        request.decision()
                                .toUpperCase()) {

                    case "APPROVED" ->
                            CreativeAsset.Status.APPROVED;

                    case "REJECTED" ->
                            CreativeAsset.Status.REJECTED;

                    default ->
                            CreativeAsset.Status.REJECTED;
                });

        assetRepo.save(asset);

        var approval =
                CreativeApproval.builder()
                        .asset(asset)
                        .reviewerId(
                                request.reviewerId())
                        .reviewDate(
                                LocalDate.now())
                        .decision(
                                request.decision())
                        .feedback(
                                request.feedback())
                        .status("COMPLETED")
                        .build();

        log.info(
                "Asset {} reviewed with decision {}",
                assetId,
                request.decision());

        return approvalRepo.save(approval);
    }
    public List<ApprovalResponse> getAllApprovals() {

    log.info("Fetching all approvals");

    return approvalRepo.findAll()
            .stream()
            .map(approval ->
                    ApprovalResponse.builder()
                            .approvalId(
                                    approval.getApprovalId())
                            .assetId(
                                    approval.getAsset()
                                            .getAssetId())
                            .reviewerId(
                                    approval.getReviewerId())
                            .reviewDate(
                                    approval.getReviewDate())
                            .decision(
                                    approval.getDecision())
                            .feedback(
                                    approval.getFeedback())
                            .status(
                                    approval.getStatus())
                            .build())
            .toList();
}



    public AssetLineItemLink linkAsset(
            AssetLinkRequest request) {

        log.info(
                "Linking asset {} with line item {}",
                request.assetId(),
                request.lineItemId());

        var asset =
                assetRepo.findById(
                        request.assetId())
                        .orElseThrow(() ->
                                new CreativeNotFoundException(
                                        "Asset Not Found"));

        if (asset.getStatus()
                != CreativeAsset.Status.APPROVED) {

            throw new RuntimeException(
                    "Only Approved Assets can be linked");
        }

        if (linkRepo.existsByAssetAndLineItemId(
                asset,
                request.lineItemId())) {

            throw new RuntimeException(
                    "Duplicate Link Not Allowed");
        }

        var link =
                AssetLineItemLink.builder()
                        .asset(asset)
                        .lineItemId(
                                request.lineItemId())
                        .linkedDate(
                                LocalDate.now())
                        .status("ACTIVE")
                        .build();

        log.info(
                "Asset {} linked successfully to line item {}",
                request.assetId(),
                request.lineItemId());

        return linkRepo.save(link);
    }
    public List<AssetLinkResponse> getAllAssetLinks() {

    log.info("Fetching all asset links");

    return linkRepo.findAll()
            .stream()
            .map(link ->
                    AssetLinkResponse.builder()
                            .linkId(
                                    link.getLinkId())
                            .assetId(
                                    link.getAsset().getAssetId())
                            .assetName(
                                    link.getAsset().getAssetName())
                            .lineItemId(
                                    link.getLineItemId())
                            .linkedDate(
                                    link.getLinkedDate())
                            .status(
                                    link.getStatus())
                            .build())
            .toList();
}
}