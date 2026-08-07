package com.cts.delivery.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cts.delivery.dto.DeliveryRequest;
import com.cts.delivery.service.DeliveryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/delivery-records")
@RequiredArgsConstructor
public class DeliveryRecordController {

    private final DeliveryService service;

    @PostMapping
    public ResponseEntity<?> create(
            @RequestBody DeliveryRequest request) {

        return ResponseEntity.ok(
                service.create(request));
    }

    @GetMapping("/io/{ioId}")
    public ResponseEntity<?> getIoDeliveries(@PathVariable Long ioId) {

        return ResponseEntity.ok(service.getIoDeliveries(ioId));
    }


    @GetMapping("/io/{ioId}/summary")
    public ResponseEntity<?> getIoSummary(@PathVariable Long ioId) {

        return ResponseEntity.ok(service.getIoSummary(ioId));
    }

    @GetMapping
    public ResponseEntity<?> getAll() {

        return ResponseEntity.ok(
                service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.getById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @PathVariable Long id) {

        service.delete(id);

        return ResponseEntity.ok(
                "Delivery Record Deleted Successfully");
    }

    @GetMapping("/line-item/{lineItemId}")
    public ResponseEntity<?> getLineItemDeliveries(
            @PathVariable Long lineItemId) {

        return ResponseEntity.ok(
                service.getLineItemDeliveries(
                        lineItemId));
    }

    @GetMapping("/line-item/{lineItemId}/summary")
    public ResponseEntity<?> getSummary(
            @PathVariable Long lineItemId) {

        return ResponseEntity.ok(
                service.getPacingSummary(
                        lineItemId));
    }

      

    
}