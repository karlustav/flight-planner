package com.example.flight_planner.service;

import com.example.flight_planner.model.Seat;
import com.example.flight_planner.repository.SeatRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.stream.Collectors;

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

    /**
     * If passengerCount == 1, apply preferences.
     * If passengerCount > 1, ignore preferences and find a block of adjacent seats.
     * 
     * "Adjacent" here means same row with consecutive letters (e.g., A1, B1),
     * except that the transition from "C" to "D" is not allowed (simulating an aisle).
     */
    public List<Seat> recommendSeats(Long flightId,
                                     int passengerCount,
                                     List<String> excludedSeatNumbers,
                                     boolean window,
                                     boolean legroom,
                                     boolean nearExit) {

        // 1) Get available seats for this flight, excluding seats already selected
        List<Seat> seats = seatRepository.findByFlightId(flightId).stream()
                .filter(Seat::isAvailable)
                .filter(s -> !excludedSeatNumbers.contains(s.getSeatNumber()))
                .collect(Collectors.toList());

        // 2) If only 1 passenger, apply preferences
        if (passengerCount == 1) {
            Optional<Seat> seatOpt = seats.stream()
                    .filter(s -> !window   || s.isWindow())
                    .filter(s -> !legroom || s.hasExtraLegroom())
                    .filter(s -> !nearExit  || s.isNearExit())
                    .findFirst();

            return seatOpt.map(Collections::singletonList)
                    .orElse(Collections.emptyList());
        }

        // 3) For multiple passengers, ignore window/legroom/nearExit preferences
        //    and look for a block of 'passengerCount' adjacent seats in the same row.
        //    (Assumes seatNumber format is like "A10" – a letter followed by a row number.)
        Map<Integer, List<Seat>> seatsByRow = seats.stream()
                .collect(Collectors.groupingBy(seat -> {
                    // Extract row from seatNumber (e.g., "B12" -> row 12)
                    String rowPart = seat.getSeatNumber().substring(1);
                    return Integer.parseInt(rowPart);
                }));

        for (Map.Entry<Integer, List<Seat>> entry : seatsByRow.entrySet()) {
            List<Seat> rowSeats = entry.getValue();

            // Sort seats by the seat letter (the first character)
            rowSeats.sort(Comparator.comparingInt(s -> s.getSeatNumber().charAt(0)));

            // Attempt to find a block of 'passengerCount' adjacent seats using our custom adjacency check.
            for (int i = 0; i <= rowSeats.size() - passengerCount; i++) {
                boolean blockFound = true;
                List<Seat> block = new ArrayList<>();
                block.add(rowSeats.get(i));

                for (int j = 1; j < passengerCount; j++) {
                    char prevLetter = rowSeats.get(i + j - 1).getSeatNumber().charAt(0);
                    char currLetter = rowSeats.get(i + j).getSeatNumber().charAt(0);
                    if (!areAdjacentSeats(prevLetter, currLetter)) {
                        blockFound = false;
                        break;
                    }
                    block.add(rowSeats.get(i + j));
                }

                if (blockFound) {
                    return block;
                }
            }
        }

        // 4) If no row has a suitable block, return empty list.
        return Collections.emptyList();
    }

    /**
     * Helper method to determine if two seat letters are adjacent.
     * Normally, adjacency is defined as a difference of 1 in their char code.
     * However, if the pair is 'C' followed by 'D', they are not considered adjacent.
     */
    private boolean areAdjacentSeats(char left, char right) {
        // Do not allow adjacency from 'C' to 'D'
        if (left == 'C' && right == 'D') {
            return false;
        }
        return (right - left == 1);
    }
}
