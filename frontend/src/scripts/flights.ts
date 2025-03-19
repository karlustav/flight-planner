import { fetchFlights } from "../api/flightsApi";

interface Flight {
  id: number;
  company: string;
  origin: string;
  destination: string;
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
    tbody.innerHTML = `<tr><td colspan="5">No flights available.</td></tr>`;
    return;
  }
  flights.forEach(flight => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${flight.company}</td>
      <td>${flight.origin}</td>
      <td>${flight.destination}</td>
      <td>$${flight.price}</td>
      <td><a href="flight.html?flightId=${flight.id}">View Seats</a></td>
    `;
    tbody.appendChild(tr);
  });
}

function filterFlights() {
  const originInput = (document.getElementById("origin") as HTMLInputElement).value.toLowerCase();
  const destinationInput = (document.getElementById("destination") as HTMLInputElement).value.toLowerCase();
  const timeInput = (document.getElementById("time") as HTMLInputElement).value;
  
  const filtered = allFlights.filter(flight => {
    let matches = true;
    if (originInput && !flight.origin.toLowerCase().includes(originInput)) {
      matches = false;
    }
    if (destinationInput && !flight.destination.toLowerCase().includes(destinationInput)) {
      matches = false;
    }
    // Here the time filter checks for an exact match. Adjust if needed.
    if (timeInput && flight.time !== timeInput) {
      matches = false;
    }
    return matches;
  });
  renderFlights(filtered);
}

document.getElementById("search-btn")?.addEventListener("click", filterFlights);

document.addEventListener("DOMContentLoaded", loadFlights);
