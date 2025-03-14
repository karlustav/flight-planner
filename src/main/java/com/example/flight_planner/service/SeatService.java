package com.example.flight_planner.service;

import com.example.flight_planner.model.Seat;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class SeatService {
    private List<Seat> seats = new ArrayList<>();
    private Random random = new Random();

    public SeatService() {
        // Simuleerime 20 istekohta lennukis
        for (int i = 1; i <= 20; i++) {
            seats.add(new Seat(
                    "A" + i, 
                    random.nextBoolean(),  // Kas on vaba või mitte
                    i % 6 == 1 || i % 6 == 0,  // Akna ääres
                    i % 10 == 0,  // Rohkem jalaruumi iga 10. koht
                    i <= 4  // Esimesed 4 kohta väljapääsu lähedal
            ));
        }
    }

    public List<Seat> getAllSeats() {
        return seats;
    }

    public Seat recommendSeat(boolean window, boolean legroom, boolean nearExit) {
        return seats.stream()
                .filter(Seat::isAvailable)
                .filter(s -> !window || s.isWindow())  // Kontrollib, kas soovitakse aknakohta
                .filter(s -> !legroom || s.hasExtraLegroom())  // Kontrollib, kas soovitakse jalaruumi
                .filter(s -> !nearExit || s.isNearExit())  // Kontrollib, kas soovitakse väljapääsu lähedale
                .findFirst()
                .orElse(null);
    }
}
