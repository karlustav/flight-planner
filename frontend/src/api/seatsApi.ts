const API_URL = "http://localhost:8080/api/seats";

export async function fetchSeatsByFlight(flightId: number) {
  const response = await fetch(`${API_URL}/flight/${flightId}`);
  if (!response.ok) throw new Error("Failed to fetch seats");
  return response.json();
}
