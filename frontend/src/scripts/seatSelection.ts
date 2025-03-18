import { fetchSeatsByFlight } from "../api/seatsApi";
import { fetchFlightById } from "../api/flightsApi";

// Get flight ID from URL
const urlParams = new URLSearchParams(window.location.search);
const flightId = Number(urlParams.get("flightId"));

document.addEventListener("DOMContentLoaded", async () => {
  if (!flightId) {
    document.getElementById("flightTitle")!.textContent = "Invalid Flight ID";
    return;
  }

  try {
    const flight = await fetchFlightById(flightId);
    document.getElementById("flightTitle")!.textContent = `Flight ${flight.id}: ${flight.origin} → ${flight.destination}`;
    document.getElementById("flightDetails")!.innerHTML = `Company: ${flight.company} <br> Price: $${flight.price}`;

    const seats = await fetchSeatsByFlight(flightId);
    renderSeats(seats);
  } catch (error) {
    console.error("Error loading flight:", error);
  }
});

function renderSeats(seats: any[]) {
  const container = document.getElementById("seatContainer")!;
  container.innerHTML = "";

  seats.forEach(seat => {
    const button = document.createElement("button");
    button.textContent = seat.seatNumber;
    button.className = seat.isAvailable ? "seat available" : "seat booked";
    button.disabled = !seat.isAvailable;
    
    button.addEventListener("click", () => {
      document.querySelectorAll(".seat.selected").forEach(el => el.classList.remove("selected"));
      button.classList.add("selected");
    });

    container.appendChild(button);
  });
}
