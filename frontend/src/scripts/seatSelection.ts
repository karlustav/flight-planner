// src/scripts/seatSelection.ts

import { fetchSeatsByFlight, getRecommendedSeat } from "../api/seatsApi";
import { getFlightById } from "../api/flightsApi";

// 1) Read flightId from query params
const urlParams = new URLSearchParams(window.location.search);
const flightId = Number(urlParams.get("flightId"));

// 2) Price info & currently selected seats
let basePrice = 0;
let selectedSeats: Set<string> = new Set();

// 3) On page load, fetch flight details + seats
document.addEventListener("DOMContentLoaded", async () => {
  if (!flightId) {
    document.getElementById("flightTitle")!.textContent = "Invalid Flight";
    return;
  }

  try {
    // Fetch flight details
    const flight = await getFlightById(flightId);
    basePrice = flight.price;
    
    document.getElementById("flightTitle")!.textContent = `Flight: ${flight.origin} → ${flight.destination}`;
    document.getElementById("flightOrigin")!.textContent = flight.origin;
    document.getElementById("flightDestination")!.textContent = flight.destination;
    document.getElementById("flightTime")!.textContent = new Date(flight.departureTime).toLocaleString("en-GB");
    document.getElementById("flightPrice")!.textContent = basePrice.toString();

    // Fetch and render seats
    const seats = await fetchSeatsByFlight(flightId);
    renderSeats(seats);
  } catch (error) {
    console.error("Error loading flight:", error);
  }
});

// 4) Render seats in rows
function renderSeats(seats: any[]) {
  const container = document.getElementById("seatContainer")!;
  container.innerHTML = "";

  // Group seats by row number
  const rows: Record<number, any[]> = {};
  seats.forEach((seat) => {
    const rowNum = parseInt(seat.seatNumber.slice(1));
    if (!rows[rowNum]) {
      rows[rowNum] = [];
    }
    rows[rowNum].push(seat);
  });

  // Sort rows by row number
  Object.keys(rows)
    .map(Number)
    .sort((a, b) => a - b)
    .forEach((rowNum) => {
      const rowSeats = rows[rowNum].sort((a, b) => a.seatNumber[0].localeCompare(b.seatNumber[0]));

      const rowDiv = document.createElement("div");
      rowDiv.className = "seat-row";

      const leftSection = document.createElement("div");
      leftSection.className = "seat-section";
      const rightSection = document.createElement("div");
      rightSection.className = "seat-section";
      const aisleDiv = document.createElement("div");
      aisleDiv.className = "aisle";

      rowSeats.forEach((seat) => {
        const seatButton = document.createElement("button");
        seatButton.textContent = seat.seatNumber;

        // Data attribute for easy lookup
        seatButton.setAttribute("data-seat-number", seat.seatNumber);

        // Class name depends on availability
        seatButton.className = seat.available ? "seat available" : "seat booked";
        seatButton.disabled = !seat.available;

        seatButton.addEventListener("click", () => toggleSeatSelection(seat.seatNumber, seatButton));

        // A/B/C go left, else right
        if (["A", "B", "C"].includes(seat.seatNumber[0])) {
          leftSection.appendChild(seatButton);
        } else {
          rightSection.appendChild(seatButton);
        }
      });

      rowDiv.appendChild(leftSection);
      rowDiv.appendChild(aisleDiv);
      rowDiv.appendChild(rightSection);
      container.appendChild(rowDiv);
    });
}

// 5) Handle seat selection
function toggleSeatSelection(seatNumber: string, button: HTMLElement) {
  // Remove the recommended blinking if it was recommended
  if (button.classList.contains("recommended")) {
    button.classList.remove("recommended");
  }

  // Toggle the "selected" state
  if (selectedSeats.has(seatNumber)) {
    selectedSeats.delete(seatNumber);
    button.classList.remove("selected");
  } else {
    selectedSeats.add(seatNumber);
    button.classList.add("selected");
  }
  updateTotalPrice();
}

// 6) Update total price
function updateTotalPrice() {
  const totalPrice = selectedSeats.size * basePrice;
  document.getElementById("totalPrice")!.textContent = totalPrice.toString();
}

// 7) Clear old recommended seats
function clearRecommendedSeats() {
  const recommendedButtons = document.querySelectorAll("button.seat.recommended");
  recommendedButtons.forEach((btn) => btn.classList.remove("recommended"));
}

// 8) Mark seat as recommended (blinking effect, scroll into view, etc.)
function markSeatAsRecommended(seatNumber: string) {
  const seatElement = document.querySelector(
    `button.seat.available[data-seat-number="${seatNumber}"]`
  ) as HTMLElement | null;

  if (seatElement) {
    seatElement.classList.add("recommended");
    seatElement.scrollIntoView({ behavior: "smooth", block: "center" });
  } else {
    console.warn(`Recommended seat "${seatNumber}" not found in the UI`);
  }
}

// 9) "Recommend Seat" button logic
document.getElementById("recommend-seat-btn")!.addEventListener("click", async () => {
  try {
    // Remove any old recommended blinking
    clearRecommendedSeats();

    // Read how many passengers from <select id="passengerCount">
    const passengerCountInput = document.getElementById("passengerCount") as HTMLSelectElement;
    const passengerCount = parseInt(passengerCountInput.value, 10) || 1;

    // For a single passenger, we consider window/legroom/nearExit
    // For multiple passengers, the backend will ignore these preferences
    const windowPref = (document.getElementById("pref-window") as HTMLInputElement).checked;
    const legroomPref = (document.getElementById("pref-legroom") as HTMLInputElement).checked;
    const exitPref = (document.getElementById("pref-exit") as HTMLInputElement).checked;

    // Already selected seats should be excluded from the recommendation
    const excludedSeats = Array.from(selectedSeats).join(",");

    // Call the backend
    const recommendedSeats = await getRecommendedSeat({
      flightId,
      passengerCount,
      window: windowPref,
      legroom: legroomPref,
      nearExit: exitPref,
      excluded: excludedSeats
    });

    // If we got seats, blink them
    if (recommendedSeats.length > 0) {
      recommendedSeats.forEach((seat) => markSeatAsRecommended(seat.seatNumber));
    } else {
      console.warn("No recommended seats found");
    }
  } catch (error) {
    console.error("Error recommending seats:", error);
  }
});
