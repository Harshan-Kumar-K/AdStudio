package com.cts.adstudio.finance.billing.entity;

import com.cts.adstudio.finance.billing.enums.ClientInvoiceStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

/**
 * ClientInvoice (Backend Plan §4). Cross-aggregate references (advertiser,
 * campaign brief) are held as ids rather than @ManyToOne so the billing module
 * compiles and unit-tests independently of the other devs' modules and avoids
 * cross-module entity coupling; the columns still map 1:1 to the FK columns.
 */
@Entity
@Table(name = "client_invoice")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClientInvoice {

    @Id // this is for Primary Key
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    //  This is the unique ID of each invoice. It auto-increments in the database

    private Long id;

    @Column(nullable = false)
    private Long advertiserId;          // FK -> advertiser.id /*We only store the ID of advertiser and campaign, not full objects, to keep the module simple and independent.

    private Long campaignBriefId;       // FK -> campaign_brief.id */

    @Column(length = 20)
    private String billingPeriod;       // e.g. "    "  Stores month like "2026-06"

    //  Money Fields
    @Column(nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal invoiceAmount = BigDecimal.ZERO; // These store money values

    @Column(nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal agencyCommission = BigDecimal.ZERO;// We use BigDecimal instead of double to avoid calculation errors in money

    @Column(nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal netBillable = BigDecimal.ZERO;//  If no value is given → default = 0. Prevents errors (no null values)

    //
    private LocalDate issuedDate;// Stores when invoice was created (only date, no time)


    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)/* Stores invoice status like:

                                                    DRAFT
                                                    PAID
                                                    CANCELLED

💡                                                 Stored as text in DB, not numbers → easier to read and safer*/
    @Builder.Default
    private ClientInvoiceStatus status = ClientInvoiceStatus.DRAFT;


    @CreationTimestamp
    @Column(updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;
}
