package com.example.flight_planner.service;

import com.example.flight_planner.model.Flight;
import com.example.flight_planner.repository.FlightRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FlightService {
    
    private final FlightRepository flightRepository;

    // Injecting the repository using constructor
    public FlightService(FlightRepository flightRepository) {
        this.flightRepository = flightRepository;
    }

    public List<Flight> getAllFlights() {
        return flightRepository.findAll(); // Ensure repository has `findAll()`
    }
}
