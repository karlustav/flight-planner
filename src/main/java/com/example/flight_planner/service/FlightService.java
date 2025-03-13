package com.example.flight_planner.service;

import com.example.flight_planner.model.Flight;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class FlightService {
    private final List<Flight> flights = new ArrayList<>();

    public FlightService() {
        // Lisame mõned testlennud
        flights.add(new Flight("1", "Tallinn", "London", LocalDateTime.now().plusDays(1), 120.0));
        flights.add(new Flight("2", "Tallinn", "New York", LocalDateTime.now().plusDays(2), 450.0));
    }

    public List<Flight> getAllFlights() {
        return flights;
    }
}