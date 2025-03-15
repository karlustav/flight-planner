package com.example.flight_planner.model;

import java.time.LocalDateTime;


public class Flight {
    private String id;
    private String from;
    private String to;
    private LocalDateTime departureTime;
    private double price;

    public Flight(String id, String from, String to, LocalDateTime departureTime, double price) {
        this.id = id;
        this.from = from;
        this.to = to;
        this.departureTime = departureTime;
        this.price = price;
    }

    public String getId() { return id; }
    public String getFrom() { return from; }
    public String getTo() { return to; }
    public LocalDateTime getDepartureTime() { return departureTime; }
    public double getPrice() { return price; }
}
