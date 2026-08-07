package com.cts.adstudio.finance.billing.dto;

import java.math.BigDecimal;

public class PaymentTrackerDTO {

    private BigDecimal totalBilled;
    private BigDecimal collected;
    private BigDecimal outstanding;
    private BigDecimal overdue;
    private Integer paidCount;
    private Integer overdueCount;
    private Integer disputedCount;

    public PaymentTrackerDTO() {}

    public BigDecimal getTotalBilled() { return totalBilled; }
    public void setTotalBilled(BigDecimal totalBilled) { this.totalBilled = totalBilled; }

    public BigDecimal getCollected() { return collected; }
    public void setCollected(BigDecimal collected) { this.collected = collected; }

    public BigDecimal getOutstanding() { return outstanding; }
    public void setOutstanding(BigDecimal outstanding) { this.outstanding = outstanding; }

    public BigDecimal getOverdue() { return overdue; }
    public void setOverdue(BigDecimal overdue) { this.overdue = overdue; }

    public Integer getPaidCount() { return paidCount; }
    public void setPaidCount(Integer paidCount) { this.paidCount = paidCount; }

    public Integer getOverdueCount() { return overdueCount; }
    public void setOverdueCount(Integer overdueCount) { this.overdueCount = overdueCount; }

    public Integer getDisputedCount() { return disputedCount; }
    public void setDisputedCount(Integer disputedCount) { this.disputedCount = disputedCount; }
}