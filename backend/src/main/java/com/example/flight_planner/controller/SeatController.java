package com.example.flight_planner.controller;

import com.example.flight_planner.model.Seat;
import com.example.flight_planner.service.SeatService;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

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

    @GetMapping("/flight/{flightId}")
    public List<Seat> getSeatsByFlight(@PathVariable Long flightId) {
        return seatService.getSeatsByFlight(flightId);
    }

    /**
     * Returns a list of recommended seats. If passengerCount == 1,
     * we filter by window/legroom/nearExit. If passengerCount > 1,
     * we ignore those preferences and look for adjacent seats in the same row.
     */
    @GetMapping("/recommend")
    public List<Seat> recommendSeats(
            @RequestParam Long flightId,
            @RequestParam(defaultValue = "1") int passengerCount,
            @RequestParam(defaultValue = "") String excluded,
            @RequestParam(defaultValue = "false") boolean window,
            @RequestParam(defaultValue = "false") boolean legroom,
            @RequestParam(defaultValue = "false") boolean nearExit
    ) {
        // Convert comma-separated string of excluded seats into a list
        List<String> excludedList = Arrays.stream(excluded.split(","))
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());

        return seatService.recommendSeats(
                flightId,
                passengerCount,
                excludedList,
                window,
                legroom,
                nearExit
        );
    }
}
