import { fetchSeatsByFlight } from "../api/seatsApi";
import { getFlightById } from "../api/flightsApi";

const urlParams = new URLSearchParams(window.location.search);
const flightId = Number(urlParams.get("flightId"));

let basePrice = 0;
let selectedSeats: Set<string> = new Set();

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

function renderSeats(seats: any[]) {
  const container = document.getElementById("seatContainer")!;
  container.innerHTML = "";

  // Group seats by row number
  const rows: Record<number, any[]> = {};
  seats.forEach(seat => {
    const rowNum = parseInt(seat.seatNumber.slice(1));
    if (!rows[rowNum]) rows[rowNum] = [];
    rows[rowNum].push(seat);
  });

  // Sort rows and seat letters
  Object.keys(rows)
    .map(Number)
    .sort((a, b) => a - b)
    .forEach(rowNum => {
      const rowSeats = rows[rowNum].sort((a, b) =>
        a.seatNumber[0].localeCompare(b.seatNumber[0])
      );

      const rowDiv = document.createElement("div");
      rowDiv.className = "seat-row";

      const leftSection = document.createElement("div");
      leftSection.className = "seat-section";
      const rightSection = document.createElement("div");
      rightSection.className = "seat-section";
      const aisleDiv = document.createElement("div");
      aisleDiv.className = "aisle";

      rowSeats.forEach(seat => {
        const seatButton = document.createElement("button");
        seatButton.textContent = seat.seatNumber;

        // ✅ Add the data attribute:
        seatButton.setAttribute("data-seat-number", seat.seatNumber);

        seatButton.className = seat.available ? "seat available" : "seat booked";
        seatButton.disabled = !seat.available;

        seatButton.addEventListener("click", () =>
          toggleSeatSelection(seat.seatNumber, seatButton)
        );

        (["A", "B", "C"].includes(seat.seatNumber[0])
          ? leftSection
          : rightSection
        ).appendChild(seatButton);
      });

      rowDiv.appendChild(leftSection);
      rowDiv.appendChild(aisleDiv);
      rowDiv.appendChild(rightSection);
      container.appendChild(rowDiv);
    });
}


function toggleSeatSelection(seatNumber: string, button: HTMLElement) {
  if (selectedSeats.has(seatNumber)) {
    selectedSeats.delete(seatNumber);
    button.classList.remove("selected");
  } else {
    selectedSeats.add(seatNumber);
    button.classList.add("selected");
  }
  updateTotalPrice();
}

function highlightRecommendedSeat(seatNumber: string) {
  // Query a seat that is both .seat.available and has data-seat-number="..."
  const seatElement = document.querySelector(
    `button.seat.available[data-seat-number="${seatNumber}"]`
  ) as HTMLElement | null;

  if (seatElement) {
    seatElement.classList.add("selected");
  } else {
    console.warn(`Recommended seat "${seatNumber}" not found in the UI`);
  }
}


function updateTotalPrice() {
  const totalPrice = selectedSeats.size * basePrice;
  document.getElementById("totalPrice")!.textContent = totalPrice.toString();
}


export async function getRecommendedSeat(options: {
  window: boolean;
  legroom: boolean;
  nearExit: boolean;
}): Promise<any> {
  const query = new URLSearchParams({
    window: options.window.toString(),
    legroom: options.legroom.toString(),
    nearExit: options.nearExit.toString(),
  });

  const response = await fetch(`http://localhost:8080/api/seats/recommend?${query.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch recommended seat");
  }
  return response.json();
}


document.getElementById("recommend-seat-btn")!.addEventListener("click", async () => {
  try {
    // 1. Read checkbox preferences (if applicable)
    const windowPref = (document.getElementById("pref-window") as HTMLInputElement).checked;
    const legroomPref = (document.getElementById("pref-legroom") as HTMLInputElement).checked;
    const exitPref = (document.getElementById("pref-exit") as HTMLInputElement).checked;

    // 2. Call your backend to get a recommended seat
    const recommendedSeat = await getRecommendedSeat({
      window: windowPref,
      legroom: legroomPref,
      nearExit: exitPref
    });

    // 3. If a seat is returned, highlight it
    if (recommendedSeat && recommendedSeat.seatNumber) {
      highlightRecommendedSeat(recommendedSeat.seatNumber);
    } else {
      console.warn("No recommended seat found");
    }
  } catch (error) {
    console.error("Error recommending seat:", error);
  }
});

