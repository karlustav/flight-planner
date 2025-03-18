package com.example.flight_planner.repository;

import com.example.flight_planner.model.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> { // Change to Long
    List<Seat> findByFlightId(Long flightId); // Fetch seats for a specific flight
}
