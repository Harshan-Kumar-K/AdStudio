package com.cts.adstudio.finance.billing.repository;

import java.math.BigDecimal;

public interface  ClientInvoiceSummary {
    BigDecimal getTotalBilled();
    BigDecimal getCollected();
    BigDecimal getOutstanding();
    BigDecimal getOverdue();
    Long getPaidCount();
    Long getOverdueCount();
    Long getDisputedCount();
}
