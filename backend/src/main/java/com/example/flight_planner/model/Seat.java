package com.example.flight_planner.model;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "seats")
public class Seat implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Unique identifier for each seat entry

    @Column(nullable = false)
    private String seatNumber;  // Seat label (e.g., "A1")

    @ManyToOne(fetch = FetchType.LAZY) // Many seats belong to one flight
    @JoinColumn(name = "flight_id", nullable = false)
    private Flight flight;
    
    private boolean isAvailable;
    private boolean isWindow;
    private boolean hasExtraLegroom;
    private boolean isNearExit;

    // Default constructor for JPA
    public Seat() {}

    public Seat(String seatNumber, Flight flight, boolean isAvailable, boolean isWindow, boolean hasExtraLegroom, boolean isNearExit) {
        this.seatNumber = seatNumber;
        this.flight = flight;
        this.isAvailable = isAvailable;
        this.isWindow = isWindow;
        this.hasExtraLegroom = hasExtraLegroom;
        this.isNearExit = isNearExit;
    }

    public Long getId() { return id; }
    public String getSeatNumber() { return seatNumber; }
    public Flight getFlight() { return flight; }
    public boolean isAvailable() { return isAvailable; }
    public boolean isWindow() { return isWindow; }
    public boolean hasExtraLegroom() { return hasExtraLegroom; }
    public boolean isNearExit() { return isNearExit; }
}
