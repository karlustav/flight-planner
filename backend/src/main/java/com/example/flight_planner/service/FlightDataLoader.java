package com.example.flight_planner.service;

import com.example.flight_planner.model.Flight;
import com.example.flight_planner.model.Seat;
import com.example.flight_planner.repository.FlightRepository;
import com.example.flight_planner.repository.SeatRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Component
public class FlightDataLoader implements CommandLineRunner {

    private final FlightRepository flightRepository;
    private final SeatRepository seatRepository;
    private final Random random = new Random(); // Create a Random instance

    public FlightDataLoader(FlightRepository flightRepository, SeatRepository seatRepository) {
        this.flightRepository = flightRepository;
        this.seatRepository = seatRepository;
    }

    @Override
    public void run(String... args) {
        if (flightRepository.count() == 0) { // Only load if the database is empty
            List<Flight> sampleFlights = List.of(
                new Flight("Finnair", "Tallinn", "London", generateRandomDate(), Math.round(Math.random() * 400 + 50)),
                new Flight("Turkish Airlines", "Paris", "Berlin", generateRandomDate(), Math.round(Math.random() * 400 + 50)),
                new Flight("Lufthansa", "New York", "Los Angeles", generateRandomDate(), Math.round(Math.random() * 400 + 50)),
                new Flight("Ryanair", "Tokyo", "Seoul", generateRandomDate(), Math.round(Math.random() * 400 + 50)),
                new Flight("Ryanair", "Tallinn", "Helsinki", generateRandomDate(), Math.round(Math.random() * 400 + 50)),
                new Flight("Lufthansa", "Tallinn", "Sydney", generateRandomDate(), Math.round(Math.random() * 400 + 50)),
                new Flight("Finnair", "Tallinn", "Tokyo", generateRandomDate(), Math.round(Math.random() * 400 + 50)),
                new Flight("Ryanair", "Tallinn", "Stockholm", generateRandomDate(), Math.round(Math.random() * 400 + 50)),
                new Flight("Turkish Airlines", "Tallinn", "Dubai", generateRandomDate(), Math.round(Math.random() * 400 + 50)),
                new Flight("Finnair", "Tallinn", "New York", generateRandomDate(), Math.round(Math.random() * 400 + 50)),
                new Flight("Lufthansa", "Tallinn", "Madrid", generateRandomDate(), Math.round(Math.random() * 400 + 50)),
                new Flight("Turkish Airlines", "Tallinn", "Los Angeles", generateRandomDate(), Math.round(Math.random() * 400 + 50)),
                new Flight("Ryanair", "Tallinn", "London", generateRandomDate(), Math.round(Math.random() * 400 + 50)),
                new Flight("Finnair", "Tallinn", "Berlin", generateRandomDate(), Math.round(Math.random() * 400 + 50)),
                new Flight("Lufthansa", "Tallinn", "Seoul", generateRandomDate(), Math.round(Math.random() * 400 + 50))
            );

            flightRepository.saveAll(sampleFlights);
            
            // Generate seats for each flight
            for (Flight flight : sampleFlights) {
                double takenAmount = Math.random() * 0.4 + 0.3;
                for (int row = 1; row <= 15; row++) {
                    for (char letter : new char[]{'A', 'B', 'C', 'D', 'E', 'F'}) {
                        seatRepository.save(new Seat(
                                letter + String.valueOf(row),
                                flight,
                                Math.random() > takenAmount,
                                letter == 'A' || letter == 'F', // Window seat
                                row % 5 == 1,  // Extra legroom
                                row <= 2 || row >= 13 // Near exit
                        ));
                    }
                }
            }
            System.out.println("Sample flight data and seats loaded.");
        }
    }

    // Generate a random departure date within the next 2 months at a random half-hour time
    private LocalDateTime generateRandomDate() {
        int daysToAdd = random.nextInt(60) + 1; // Random number of days (1-60)
        int hour = random.nextInt(24); // Random hour (0-23)
        int minute = random.nextBoolean() ? 0 : 30; // Either 00 or 30 minutes

        return LocalDateTime.now()
                .plusDays(daysToAdd)
                .withHour(hour)
                .withMinute(minute)
                .withSecond(0)
                .withNano(0);
    }
}
