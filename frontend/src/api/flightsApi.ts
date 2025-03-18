const API_URL = "/api/flights"; // or "http://localhost:8080/api/flights"

export async function fetchFlights() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error(`Failed to fetch flights: ${response.status}`);
  return response.json();
}

// 🔴 Add this function:
export async function fetchFlightById(flightId: number) {
  const response = await fetch(`${API_URL}/${flightId}`);
  if (!response.ok) throw new Error(`Failed to fetch flight with ID ${flightId}`);
  return response.json();
}
