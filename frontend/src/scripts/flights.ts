import { fetchFlights } from "../api/flightsApi";

interface Flight {
  id: number;
  company: string;
  origin: string;
  destination: string;
  departureTime: string;
  price: number;
  time: string;
}

let allFlights: Flight[] = [];

async function loadFlights() {
  try {
    allFlights = await fetchFlights();
    renderFlights(allFlights);
  } catch (error) {
    console.error("Error fetching flights:", error);
    const tbody = document.querySelector("#flightsTable tbody");
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="5" style="color:red;">Error loading flights. Check console.</td></tr>`;
    }
  }
}

function renderFlights(flights: Flight[]) {
  const tbody = document.querySelector("#flightsTable tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (flights.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6">No flights available.</td></tr>`;
    return;
  }

  // **Sort flights by departureTime**
  flights.sort((a, b) => new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime());

  flights.forEach(flight => {
    const departureDate = new Date(flight.departureTime);
    const formattedDate = departureDate.toLocaleDateString("en-GB").replace(/\//g, "."); // Format: DD.MM.YYYY
    const formattedTime = departureDate.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }); // HH:MM format

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${flight.company}</td>
      <td>${flight.origin}</td>
      <td>${flight.destination}</td>
      <td>${formattedDate} ${formattedTime}</td> <!-- Date and Time in one cell -->
      <td>$${flight.price}</td>
      <td><a href="flight.html?flightId=${flight.id}" class="btn buy-btn">Buy Ticket</a></td>
    `;
    tbody.appendChild(tr);
  });
}





function filterFlights() {
  const originInput = (document.getElementById("origin") as HTMLInputElement).value.toLowerCase();
  const destinationInput = (document.getElementById("destination") as HTMLInputElement).value.toLowerCase();
  const dateInput = (document.getElementById("date") as HTMLInputElement).value; // Ensure this is a date input

  const filtered = allFlights.filter(flight => {
    let matches = true;
    if (originInput && !flight.origin.toLowerCase().includes(originInput)) {
      matches = false;
    }
    if (destinationInput && !flight.destination.toLowerCase().includes(destinationInput)) {
      matches = false;
    }
    if (dateInput) {
      const flightDate = new Date(flight.departureTime).toISOString().split("T")[0]; // Extract only YYYY-MM-DD
      if (flightDate !== dateInput) {
        matches = false;
      }
    }
    return matches;
  });

  renderFlights(filtered);
}

const searchInputs = document.querySelectorAll<HTMLInputElement>("#origin, #destination, #date");
searchInputs.forEach(input => {
  input.addEventListener("keypress", (event: KeyboardEvent) => { // Explicitly type as KeyboardEvent
    if (event.key === "Enter") {
      event.preventDefault(); // Prevents form submission if inside a form
      filterFlights();
    }
  });
});


document.getElementById("search-btn")?.addEventListener("click", filterFlights);

document.addEventListener("DOMContentLoaded", loadFlights);
