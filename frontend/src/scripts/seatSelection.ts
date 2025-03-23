import { fetchSeatsByFlight, getRecommendedSeat } from "../api/seatsApi";
import { getFlightById } from "../api/flightsApi";

// Read flightId from query params
const urlParams = new URLSearchParams(window.location.search);
const flightId = Number(urlParams.get("flightId"));

// Price info & currently selected seats
let basePrice = 0;
let selectedSeats: Set<string> = new Set();

// On page load, fetch flight details + seats
document.addEventListener("DOMContentLoaded", async () => {
  if (!flightId) {
    document.getElementById("flightTitle")!.textContent = "Invalid Flight";
    return;
  }

  updateConfirmButtonState();

  try {
    // Fetch flight details
    const flight = await getFlightById(flightId);
    basePrice = flight.price;
    
    document.getElementById("flightTitle")!.textContent = `${flight.origin} → ${flight.destination}`;
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

// Render seats in rows, marking any already booked for THIS flight
function renderSeats(seats: any[]) {
  const container = document.getElementById("seatContainer")!;
  container.innerHTML = "";
  const bookedSeats = getBookedSeatsForFlight(flightId);

  // Group seats by row number
  const rows: Record<number, any[]> = {};
  seats.forEach((seat) => {
    const rowNum = parseInt(seat.seatNumber.slice(1));
    if (!rows[rowNum]) {
      rows[rowNum] = [];
    }
    rows[rowNum].push(seat);
  });

  // Sort rows by row number and render each row
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
        seatButton.setAttribute("data-seat-number", seat.seatNumber);

        // If the seat is booked for this flight, apply booked styling
        if (bookedSeats.includes(seat.seatNumber)) {
          seatButton.className = "seat booked";
          seatButton.disabled = true;
        } else {
          seatButton.className = seat.available ? "seat available" : "seat booked";
          seatButton.disabled = !seat.available;
          // Only add click listener if the seat is available
          if (seat.available) {
            seatButton.addEventListener("click", () => toggleSeatSelection(seat.seatNumber, seatButton));
          }
        }

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

// Handle seat selection
function toggleSeatSelection(seatNumber: string, button: HTMLElement) {
  if (button.classList.contains("recommended")) {
    button.classList.remove("recommended");
  }
  if (selectedSeats.has(seatNumber)) {
    selectedSeats.delete(seatNumber);
    button.classList.remove("selected");
  } else {
    selectedSeats.add(seatNumber);
    button.classList.add("selected");
  }
  updateTotalPrice();
  updateConfirmButtonState();
}

// Update total price
function updateTotalPrice() {
  const totalPrice = selectedSeats.size * basePrice;
  document.getElementById("totalPrice")!.textContent = totalPrice.toString();
}

// Clear old recommended seats
function clearRecommendedSeats() {
  const recommendedButtons = document.querySelectorAll("button.seat.recommended");
  recommendedButtons.forEach((btn) => btn.classList.remove("recommended"));
}

// Mark seat as recommended (blinking effect, scroll into view, etc.)
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

document.getElementById("recommend-seat-btn")!.addEventListener("click", async () => {
  hideRecommendationError();
  try {
    clearRecommendedSeats();
    const passengerCountInput = document.getElementById("passengerCount") as HTMLSelectElement;
    const passengerCount = parseInt(passengerCountInput.value, 10) || 1;
    const windowPref = (document.getElementById("pref-window") as HTMLInputElement).checked;
    const legroomPref = (document.getElementById("pref-legroom") as HTMLInputElement).checked;
    const exitPref = (document.getElementById("pref-exit") as HTMLInputElement).checked;
    
    // Get the seats that are already booked for this flight.
    const bookedSeats = getBookedSeatsForFlight(flightId);
    
    // Combine currently selected seats with already booked seats.
    const excludedSet = new Set([...selectedSeats, ...bookedSeats]);
    const excludedSeats = Array.from(excludedSet).join(",");

    const recommendedSeats = await getRecommendedSeat({
      flightId,
      passengerCount,
      window: windowPref,
      legroom: legroomPref,
      nearExit: exitPref,
      excluded: excludedSeats,
    });

    if (recommendedSeats.length > 0) {
      recommendedSeats.forEach((seat) => markSeatAsRecommended(seat.seatNumber));
    } else {
      showRecommendationError("No seats available with selected preferences. Please try again.");
    }
  } catch (error) {
    console.error("Error recommending seats:", error);
    showRecommendationError("There was an error recommending seats. Please try again later.");
  }
});

function showRecommendationError(message: string) {
  const errorBanner = document.getElementById("recommendationError") as HTMLElement;
  errorBanner.textContent = message;
  errorBanner.classList.add("visible");
}

function hideRecommendationError() {
  const errorBanner = document.getElementById("recommendationError") as HTMLElement;
  errorBanner.classList.remove("visible");
}

// Confirm Booking listener (only one instance!)
document.getElementById("confirm-and-buy")!.addEventListener("click", () => {
  if (selectedSeats.size === 0) {
    return;
  }
  const flightTitle = document.getElementById("flightTitle")!.textContent || "";
  const flightOrigin = document.getElementById("flightOrigin")!.textContent || "";
  const flightDestination = document.getElementById("flightDestination")!.textContent || "";
  const flightTime = document.getElementById("flightTime")!.textContent || "";
  const flightPrice = document.getElementById("flightPrice")!.textContent || "0";
  const totalPrice = document.getElementById("totalPrice")!.textContent || "0";

  const existingBookings = sessionStorage.getItem("bookings");
  let bookings: any[] = existingBookings ? JSON.parse(existingBookings) : [];

  Array.from(selectedSeats).forEach((seatNumber) => {
    // Find the seat button regardless of its state
    const seatButton = document.querySelector(
      `button.seat[data-seat-number="${seatNumber}"]`
    ) as HTMLButtonElement | null;
    if (seatButton) {
      seatButton.classList.remove("available", "selected");
      seatButton.classList.add("booked");
      seatButton.disabled = true;
    }
    // Add this seat as booked for the current flight
    addBookedSeatForFlight(flightId, seatNumber);
    // Create a booking record for this seat
    const booking = {
      flightTitle,
      flightOrigin,
      flightDestination,
      flightTime,
      flightPrice,
      totalPrice,
      seat: seatNumber,
      timestamp: new Date().toLocaleString()
    };
    bookings.push(booking);
  });

  sessionStorage.setItem("bookings", JSON.stringify(bookings));
  selectedSeats.clear();
  updateTotalPrice();
  updateConfirmButtonState();
  window.location.href = "bookings.html";
});

// Get a reference to the confirm button
const confirmButton = document.getElementById("confirm-and-buy") as HTMLButtonElement;

// Toggle confirm button and total price container visibility
function updateConfirmButtonState() {
  const totalPriceContainer = document.getElementById("totalPriceContainer");
  if (selectedSeats.size === 0) {
    confirmButton.style.display = "none";
    if (totalPriceContainer) {
      totalPriceContainer.style.display = "none";
    }
  } else {
    confirmButton.style.display = "inline-block";
    if (totalPriceContainer) {
      totalPriceContainer.style.display = "block";
    }
  }
}

// Grab references to the select and checkboxes for preferences
const passengerCountInput = document.getElementById("passengerCount") as HTMLSelectElement;
const prefWindow = document.getElementById("pref-window") as HTMLInputElement;
const prefLegroom = document.getElementById("pref-legroom") as HTMLInputElement;
const prefExit = document.getElementById("pref-exit") as HTMLInputElement;

function togglePreferenceCheckboxes() {
  const passengerCount = parseInt(passengerCountInput.value, 10);
  const isSingle = passengerCount === 1;
  [prefWindow, prefLegroom, prefExit].forEach(checkbox => {
    checkbox.disabled = !isSingle;
    if (!isSingle) {
      checkbox.checked = false;
    }
  });
}

togglePreferenceCheckboxes();
passengerCountInput.addEventListener("change", togglePreferenceCheckboxes);

// Flight-Specific Booked Seats Helper
function getBookedSeatsForFlight(flightId: number): string[] {
  const booked = JSON.parse(sessionStorage.getItem("bookedSeats") || "{}");
  return booked[flightId] || [];
}

function addBookedSeatForFlight(flightId: number, seat: string) {
  const booked = JSON.parse(sessionStorage.getItem("bookedSeats") || "{}");
  if (!booked[flightId]) {
    booked[flightId] = [];
  }
  if (!booked[flightId].includes(seat)) {
    booked[flightId].push(seat);
  }
  sessionStorage.setItem("bookedSeats", JSON.stringify(booked));
}
