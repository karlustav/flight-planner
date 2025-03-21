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


public Seat recommendSeat(Long flightId,
    boolean window,
    boolean legroom,
    boolean nearExit,
    List<String> excludedSeatNumbers) {
        return seatRepository.findByFlightId(flightId).stream()
        .filter(Seat::isAvailable)
        .filter(s -> !excludedSeatNumbers.contains(s.getSeatNumber()))
        .filter(s -> !window   || s.isWindow())
        .filter(s -> !legroom || s.hasExtraLegroom())
        .filter(s -> !nearExit || s.isNearExit())
        .findFirst()
        .orElse(null);
}




}
