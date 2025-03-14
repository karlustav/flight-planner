package com.example.flight_planner.controller;

import com.example.flight_planner.model.Seat;
import com.example.flight_planner.service.SeatService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/seats")
public class SeatController {
    private final SeatService seatService;

    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }

    @GetMapping
    public List<Seat> getAllSeats() {
        return seatService.getAllSeats();
    }

    @GetMapping("/recommend")
    public Seat recommendSeat(
            @RequestParam(required = false, defaultValue = "false") boolean window,
            @RequestParam(required = false, defaultValue = "false") boolean legroom,
            @RequestParam(required = false, defaultValue = "false") boolean nearExit
    ) {
        return seatService.recommendSeat(window, legroom, nearExit);
    }
}
