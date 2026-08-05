package com.cts.advertiser.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "advertiser")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Advertiser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AdvertiserID")
    private Integer advertiserId;

    @Column(name = "CompanyName", nullable = false, length = 150)
    private String companyName;

    @Column(name = "Industry", length = 100)
    private String industry;

    @Column(name = "AccountManagerID")
    private Integer accountManagerId;

    @Column(name = "AnnualBudget", precision = 15, scale = 2)
    private BigDecimal annualBudget;


    @Enumerated(EnumType.STRING)
    @Column(name = "Status")
    private AdvertiserStatus status;

    @Column(name = "CreatedAt", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "UpdatedAt")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "advertiser", fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Brand> brands;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) this.status = AdvertiserStatus.Active;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum AdvertiserStatus {
        Active, Inactive, Suspended
    }
}