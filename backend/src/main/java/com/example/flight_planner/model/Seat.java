package com.example.flight_planner.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "seats")
public class Seat {

    @Id
    private String seatNumber;  // Using seatNumber as the primary key

    private boolean isAvailable;
    private boolean isWindow;
    private boolean hasExtraLegroom;
    private boolean isNearExit;

    // Default constructor for JPA
    public Seat() {}

    public Seat(String seatNumber, boolean isAvailable, boolean isWindow, boolean hasExtraLegroom, boolean isNearExit) {
        this.seatNumber = seatNumber;
        this.isAvailable = isAvailable;
        this.isWindow = isWindow;
        this.hasExtraLegroom = hasExtraLegroom;
        this.isNearExit = isNearExit;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public boolean isAvailable() {
        return isAvailable;
    }

    public boolean isWindow() {
        return isWindow;
    }

    public boolean hasExtraLegroom() {
        return hasExtraLegroom;
    }

    public boolean isNearExit() {
        return isNearExit;
    }
    
    // Optionally, add setters if needed
}
