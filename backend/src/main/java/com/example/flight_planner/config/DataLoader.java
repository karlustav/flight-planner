package com.example.flight_planner.config;

import com.example.flight_planner.model.Flight;
import com.example.flight_planner.repository.FlightRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private FlightRepository flightRepository;

    @Override
    public void run(String... args) throws Exception {
        // Check if database is empty before adding new flights
        if (flightRepository.count() == 0) {
            Flight flight1 = new Flight("1", "New York", "Los Angeles", LocalDateTime.now().plusDays(3), 300);
            Flight flight2 = new Flight("2", "London", "Paris", LocalDateTime.now().plusDays(5), 200);
            Flight flight3 = new Flight("3", "Tokyo", "Seoul", LocalDateTime.now().plusDays(7), 400);

            flightRepository.save(flight1);
            flightRepository.save(flight2);
            flightRepository.save(flight3);

            System.out.println("Sample flight data added!");
        }
    }
}
