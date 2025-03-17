package com.example.flight_planner.service;

import com.example.flight_planner.model.Flight;
import com.example.flight_planner.repository.FlightRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class FlightDataLoader implements CommandLineRunner {

    private final FlightRepository flightRepository;

    public FlightDataLoader(FlightRepository flightRepository) {
        this.flightRepository = flightRepository;
    }

    @Override
    public void run(String... args) {
        if (flightRepository.count() == 0) { // Only load data if the database is empty
            List<Flight> sampleFlights = List.of(
                new Flight("Tallinn", "London", LocalDateTime.now().plusDays(1), 120.0),
                new Flight("Paris", "Berlin", LocalDateTime.now().plusDays(2), 95.5),
                new Flight("New York", "Los Angeles", LocalDateTime.now().plusDays(3), 350.0),
                new Flight("Tokyo", "Seoul", LocalDateTime.now().plusDays(4), 180.0)
            );

            flightRepository.saveAll(sampleFlights);
            System.out.println("Sample flight data loaded into the database.");
        }
    }
}
