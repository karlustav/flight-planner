package com.example.flight_planner.service;

import com.example.flight_planner.model.Flight;
import com.example.flight_planner.model.Seat;
import com.example.flight_planner.repository.FlightRepository;
import com.example.flight_planner.repository.SeatRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class FlightDataLoader implements CommandLineRunner {

    private final FlightRepository flightRepository;
    private final SeatRepository seatRepository;

    public FlightDataLoader(FlightRepository flightRepository, SeatRepository seatRepository) {
        this.flightRepository = flightRepository;
        this.seatRepository = seatRepository;
    }

    @Override
    public void run(String... args) {
        if (flightRepository.count() == 0) { // Only load if the database is empty
            List<Flight> sampleFlights = List.of(
                new Flight("Finnair", "Tallinn", "London", LocalDateTime.now().plusDays(1), 120.0),
                new Flight("Turkish Airlines", "Paris", "Berlin", LocalDateTime.now().plusDays(2), 95.5),
                new Flight("Lufthansa", "New York", "Los Angeles", LocalDateTime.now().plusDays(3), 350.0),
                new Flight("Ryanair", "Tokyo", "Seoul", LocalDateTime.now().plusDays(4), 180.0)
            );

            flightRepository.saveAll(sampleFlights);
            
            // Generate seats for each flight
            for (Flight flight : sampleFlights) {
                for (int row = 1; row <= 10; row++) {
                    for (char letter : new char[]{'A', 'B', 'C', 'D', 'E', 'F'}) {
                        seatRepository.save(new Seat(
                                letter + String.valueOf(row),
                                flight,
                                true,
                                letter == 'A' || letter == 'F', // Window seat
                                row % 5 == 1,  // Extra legroom
                                row <= 2 || row >= 9 // Near exit
                        ));
                    }
                }
            }
            System.out.println("Sample flight data and seats loaded.");
        }
    }
}
