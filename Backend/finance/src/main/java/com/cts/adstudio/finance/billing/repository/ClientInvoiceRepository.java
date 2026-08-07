package com.cts.adstudio.finance.billing.repository;

import com.cts.adstudio.finance.billing.entity.ClientInvoice;
import com.cts.adstudio.finance.billing.enums.ClientInvoiceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface ClientInvoiceRepository extends JpaRepository<ClientInvoice, Long> {

    Page<ClientInvoice> findByStatus(ClientInvoiceStatus status, Pageable pageable);

    Page<ClientInvoice> findByAdvertiserId(Long advertiserId, Pageable pageable);

    /** Billing calendar: invoices issued within a date window. */
    List<ClientInvoice> findByIssuedDateBetween(LocalDate start, LocalDate end);// Get all invoices issued between Jan 1 and Jan 31

    /** Payment-tracking aggregate: total net billable for an advertiser in a given status. */
    //Calculates total net billable amount for A specific advertiser (unpaid bill )
    @Query("""
            select coalesce(sum(c.netBillable), 0)
            from ClientInvoice c
            where c.advertiserId = :advertiserId and c.status = :status
            """)// coalesce(..., 0) → returns 0 instead of null if no records exist
    BigDecimal sumNetBillableByAdvertiserAndStatus(@Param("advertiserId") Long advertiserId,
                                                   @Param("status") ClientInvoiceStatus status);

    /** Payment-tracking aggregate: total net billable across all statuses for an advertiser. */

    @Query("""
            select coalesce(sum(c.netBillable), 0)
            from ClientInvoice c
            where c.advertiserId = :advertiserId
            """)
    BigDecimal sumNetBillableByAdvertiser(@Param("advertiserId") Long advertiserId);


    @Query("""
        SELECT
            COALESCE(SUM(CASE WHEN ci.status <> 'DRAFT' THEN ci.invoiceAmount ELSE 0 END), 0) AS totalBilled,
            COALESCE(SUM(CASE WHEN ci.status = 'PAID' THEN ci.invoiceAmount ELSE 0 END), 0) AS collected,
            COALESCE(SUM(CASE WHEN ci.status = 'ISSUED' THEN ci.invoiceAmount ELSE 0 END), 0) AS outstanding,
            COALESCE(SUM(CASE WHEN ci.status = 'OVERDUE' THEN ci.invoiceAmount ELSE 0 END), 0) AS overdue,
            COALESCE(SUM(CASE WHEN ci.status = 'PAID' THEN 1 ELSE 0 END), 0) AS paidCount,
            COALESCE(SUM(CASE WHEN ci.status = 'OVERDUE' THEN 1 ELSE 0 END), 0) AS overdueCount,
            COALESCE(SUM(CASE WHEN ci.status = 'DISPUTED' THEN 1 ELSE 0 END), 0) AS disputedCount
        FROM ClientInvoice ci
        """)
    ClientInvoiceSummary getPaymentSummary();
}
