package com.example.flight_planner.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Flight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String company;
    private String origin;
    private String destination;
    private LocalDateTime departureTime;
    private double price;

    @OneToMany(mappedBy = "flight", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Seat> seats = new ArrayList<>(); // Initialize to prevent NullPointerException

    // Default constructor (required for JPA)
    public Flight() {}

    public Flight(String company, String origin, String destination, LocalDateTime departureTime, double price) {
        this.company = company;
        this.origin = origin;
        this.destination = destination;
        this.departureTime = departureTime;
        this.price = price;
    }

    public Long getId() { return id; }
    public String getCompany() { return company; }
    public String getOrigin() { return origin; }
    public String getDestination() { return destination; }
    public LocalDateTime getDepartureTime() { return departureTime; }
    public double getPrice() { return price; }
    public List<Seat> getSeats() { return seats; }

    public void addSeat(Seat seat) {
        seats.add(seat);
        seat.setFlight(this); // Ensure the relationship is maintained
    }
}
