package com.cts.delivery.entity;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pacing_alerts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PacingAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long alertId;

    private Long lineItemId;

    @Enumerated(EnumType.STRING)
    private AlertType alertType;

    private LocalDate alertDate;

    private Double pacingPercent;

    @Enumerated(EnumType.STRING)
    private AlertStatus status;



    public enum AlertStatus {
        OPEN,
        ACTIONED,
        CLOSED
    }
}