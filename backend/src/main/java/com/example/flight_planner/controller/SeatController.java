package com.example.flight_planner.controller;

import com.example.flight_planner.model.Seat;
import com.example.flight_planner.service.SeatService;
import org.springframework.web.bind.annotation.*;
import java.util.Arrays;
import java.util.stream.Collectors;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/seats")
public class SeatController {
    private final SeatService seatService;

    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }

    @GetMapping
    public List<Seat> getAllSeats() {
        return seatService.getAllSeats();
    }

    @GetMapping("/flight/{flightId}") // NEW: Get seats by Flight ID
    public List<Seat> getSeatsByFlight(@PathVariable Long flightId) {
        return seatService.getSeatsByFlight(flightId);
    }

    @GetMapping("/recommend")
    public Seat recommendSeat(
            @RequestParam Long flightId,
            @RequestParam(defaultValue="") String excluded,
            @RequestParam(defaultValue="false") boolean window,
            @RequestParam(defaultValue="false") boolean legroom,
            @RequestParam(defaultValue="false") boolean nearExit
    ) {
        List<String> excludedList = Arrays.stream(excluded.split(","))
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
        return seatService.recommendSeat(flightId, window, legroom, nearExit, excludedList);
    }
    
    
}
