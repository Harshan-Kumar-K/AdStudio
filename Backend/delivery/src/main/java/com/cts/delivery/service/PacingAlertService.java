package com.cts.delivery.service;

import java.time.LocalDate;
import java.util.List;

import com.cts.delivery.client.MediaPlanFeignClient;
import com.cts.delivery.entity.AlertType;
import com.cts.delivery.shared.NotificationClient;
import com.cts.delivery.shared.PlannerResolver;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cts.delivery.dto.PacingAlertRequest;
import com.cts.delivery.entity.PacingAlert;
import com.cts.delivery.entity.PacingAlert.AlertStatus;
import com.cts.delivery.deliveryexception.PacingNotFoundException;
import com.cts.delivery.repository.PacingAlertRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PacingAlertService {

    private final PacingAlertRepository repository;
    private final NotificationClient notificationClient;
    private final PlannerResolver plannerResolver;
    private final MediaPlanFeignClient mediaPlanClient;

    public PacingAlert createAlert( PacingAlertRequest request) {

        var lineItem = mediaPlanClient.getLineItem(request.lineItemId().intValue()).data(); // fetch line item from media-plan service to get planned budget.
        Double pacingPercentCalc = request.spend().doubleValue() == 0
                ? 0.0
                : (lineItem.plannedBudget().doubleValue() / request.spend().doubleValue()) * 100;

        AlertType alertTypeCalc = calculateTheAlertType(request, lineItem);

            var alert = PacingAlert.builder()
                .lineItemId(request.lineItemId())
                .alertType(alertTypeCalc)
                .alertDate(LocalDate.now())
                .pacingPercent(pacingPercentCalc)
                .status(AlertStatus.OPEN)
                .build();

        PacingAlert saved = repository.save(alert);
        Integer plannerId = plannerResolver.resolvePlannerId(saved.getLineItemId());
        notificationClient.notify(plannerId,
                "Pacing Alert raised for line item #" + saved.getLineItemId()
                        + " (" + saved.getAlertType() + ", " + saved.getPacingPercent() + "%).",
                "Pacing");

        return saved;
    }

    public List<PacingAlert> getAllAlerts() {
        return repository.findAll();
    }

    public PacingAlert getAlert(Long id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new PacingNotFoundException(
                                "Pacing Alert Not Found"));
    }

    public List<PacingAlert> getOpenAlerts() {

        return repository.findByStatus(
                AlertStatus.OPEN);
    }

    public List<PacingAlert> getLineItemAlerts(
            Long lineItemId) {

        return repository.findByLineItemId(
                lineItemId);
    }

    public PacingAlert actionAlert(Long alertId) {
        var alert = getAlert(alertId);
        alert.setStatus(AlertStatus.ACTIONED);
        PacingAlert saved = repository.save(alert);

        Integer plannerId = plannerResolver.resolvePlannerId(saved.getLineItemId());
        notificationClient.notify(plannerId,
                "Pacing Alert #" + alertId + " was actioned.",
                "Pacing");
        return saved;
    }

    public PacingAlert closeAlert(Long alertId) {
        var alert = getAlert(alertId);
        alert.setStatus(AlertStatus.CLOSED);
        PacingAlert saved = repository.save(alert);

        Integer plannerId = plannerResolver.resolvePlannerId(saved.getLineItemId());
        notificationClient.notify(plannerId,
                "Pacing Alert #" + alertId + " was closed.",
                "Pacing");
        return saved;
    }

    public void deleteAlert(Long alertId) {

        var alert = getAlert(alertId);
        repository.delete(alert);
    }

    public AlertType calculateTheAlertType(PacingAlertRequest request, MediaPlanFeignClient.LineItemView lineItem) {
        //Is today's reporting date within the final 3 days of the campaign (or past the end)?
        // the end date is approaching take the flightend date from the mp
        if(request.reportingDate().isAfter(lineItem.flightEnd().minusDays(3)))
            return AlertType.FLIGHT_END_APPROACHING;

        if( request.deliveredImpressions() < lineItem.plannedImpressions() )
            return AlertType.UNDER_DELIVERY;
        if( request.deliveredImpressions() > lineItem.plannedImpressions())
            return AlertType.OVER_DELIVERY;

        if(request.spend() >= lineItem.plannedBudget())
            return AlertType.BUDGET_EXHAUSTED;

        return AlertType.UNDER_DELIVERY; // default case, should NEVER happen
    }
}