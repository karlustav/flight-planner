package com.example.flight_planner.service;

import com.example.flight_planner.model.Seat;
import com.example.flight_planner.repository.SeatRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SeatService {
    private final SeatRepository seatRepository;

    public SeatService(SeatRepository seatRepository) {
        this.seatRepository = seatRepository;
    }

    public List<Seat> getAllSeats() {
        return seatRepository.findAll();
    }

    public List<Seat> getSeatsByFlight(Long flightId) {
        return seatRepository.findByFlightId(flightId);
    }

    public Seat recommendSeat(boolean window, boolean legroom, boolean nearExit) {
        return seatRepository.findAll().stream()
                .filter(Seat::isAvailable)
                .filter(s -> !window || s.isWindow())  
                .filter(s -> !legroom || s.hasExtraLegroom())  
                .filter(s -> !nearExit || s.isNearExit())  
                .findFirst()
                .orElse(null);
    }
}
