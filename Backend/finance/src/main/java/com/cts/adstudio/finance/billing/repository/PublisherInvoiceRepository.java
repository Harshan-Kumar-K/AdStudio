package com.cts.adstudio.finance.billing.repository;

import com.cts.adstudio.finance.billing.entity.PublisherInvoice;
import com.cts.adstudio.finance.billing.enums.PublisherInvoiceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PublisherInvoiceRepository extends JpaRepository<PublisherInvoice, Long> {

    List<PublisherInvoice> findByPublisherId(Long publisherId);

    List<PublisherInvoice> findByStatus(PublisherInvoiceStatus status);

    List<PublisherInvoice> findByIoId(Long ioId);
}
