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

  // Group seats by row number (assuming seatNumber is in the format Letter + Number, e.g. "A1")
  const rows: Record<number, any[]> = {};
  seats.forEach(seat => {
    const rowNum = parseInt(seat.seatNumber.slice(1));
    if (!rows[rowNum]) {
      rows[rowNum] = [];
    }
    rows[rowNum].push(seat);
  });

  // Sort the row numbers
  const sortedRowNumbers = Object.keys(rows)
    .map(Number)
    .sort((a, b) => a - b);

  sortedRowNumbers.forEach(rowNum => {
    const rowSeats = rows[rowNum];

    // Sort seats in the row alphabetically by their letter
    rowSeats.sort((a, b) => {
      const letterA = a.seatNumber[0].toUpperCase();
      const letterB = b.seatNumber[0].toUpperCase();
      return letterA < letterB ? -1 : letterA > letterB ? 1 : 0;
    });

    // Split into left (A, B, C) and right (D, E, F) sections
    const leftSectionSeats = rowSeats.filter(seat =>
      ["A", "B", "C"].includes(seat.seatNumber[0].toUpperCase())
    );
    const rightSectionSeats = rowSeats.filter(seat =>
      ["D", "E", "F"].includes(seat.seatNumber[0].toUpperCase())
    );

    // Create a row container
    const rowDiv = document.createElement("div");
    rowDiv.className = "seat-row";

    // Add extra spacing every 5 rows (if the row number is divisible by 5)
    if (rowNum % 5 === 0) {
      rowDiv.classList.add("extra-gap");
    }

    // Left section container
    const leftSection = document.createElement("div");
    leftSection.className = "seat-section left";
    leftSectionSeats.forEach(seat => {
      const seatButton = document.createElement("button");
      seatButton.textContent = seat.seatNumber;
      seatButton.className = seat.isAvailable ? "seat available" : "seat booked";
      seatButton.disabled = !seat.isAvailable;
      seatButton.addEventListener("click", () => {
        rowDiv.querySelectorAll(".seat.selected").forEach(el => el.classList.remove("selected"));
        seatButton.classList.add("selected");
      });
      leftSection.appendChild(seatButton);
    });

    // Right section container
    const rightSection = document.createElement("div");
    rightSection.className = "seat-section right";
    rightSectionSeats.forEach(seat => {
      const seatButton = document.createElement("button");
      seatButton.textContent = seat.seatNumber;
      seatButton.className = seat.isAvailable ? "seat available" : "seat booked";
      seatButton.disabled = !seat.isAvailable;
      seatButton.addEventListener("click", () => {
        rowDiv.querySelectorAll(".seat.selected").forEach(el => el.classList.remove("selected"));
        seatButton.classList.add("selected");
      });
      rightSection.appendChild(seatButton);
    });

    // Create an aisle divider element
    const aisleDiv = document.createElement("div");
    aisleDiv.className = "aisle";

    // Assemble the row
    rowDiv.appendChild(leftSection);
    rowDiv.appendChild(aisleDiv);
    rowDiv.appendChild(rightSection);
    container.appendChild(rowDiv);
  });
}
