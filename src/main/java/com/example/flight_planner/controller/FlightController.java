package com.example.flight_planner.controller;

import com.example.flight_planner.model.Flight;
import com.example.flight_planner.repository.FlightRepository;
import com.example.flight_planner.service.FlightService;
import org.springframework.ui.Model;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flights")
@CrossOrigin(origins="*")
public class FlightController {

    @Autowired
    private FlightRepository flightRepository;

    private final FlightService flightService;

    public FlightController(FlightService flightService) {
        this.flightService = flightService;
    }

    @GetMapping
    public String listFlights(Model model) {
        model.addAttribute("flights", flightRepository.findAll());
        return "flights"; // flights.html
    }
}
