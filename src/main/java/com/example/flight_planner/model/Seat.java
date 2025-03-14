package com.example.flight_planner.model;

public class Seat {
    private String seatNumber;
    private boolean isAvailable;
    private boolean isWindow;
    private boolean hasExtraLegroom;
    private boolean isNearExit;

    public Seat(String seatNumber, boolean isAvailable, boolean isWindow, boolean hasExtraLegroom, boolean isNearExit) {
        this.seatNumber = seatNumber;
        this.isAvailable = isAvailable;
        this.isWindow = isWindow;
        this.hasExtraLegroom = hasExtraLegroom;
        this.isNearExit = isNearExit;
    }

    public String getSeatNumber() { return seatNumber; }
    public boolean isAvailable() { return isAvailable; }
    public boolean isWindow() { return isWindow; }
    public boolean hasExtraLegroom() { return hasExtraLegroom; }
    public boolean isNearExit() { return isNearExit; }
}
