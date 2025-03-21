// src/api/seatsApi.ts

// Use a relative path so Vite’s proxy (vite.config.ts) can handle it.
// If you want to skip the proxy, you can do: const BASE_URL = "http://localhost:8080/api/seats";
const BASE_URL = "/api/seats";

/**
 * Fetch seats for a given flight, from the endpoint:
 * GET /api/seats/flight/{flightId}
 */
export async function fetchSeatsByFlight(flightId: number) {
  // Correct path: /api/seats/flight/{flightId}
  const response = await fetch(`${BASE_URL}/flight/${flightId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch seats: ${response.status}`);
  }
  return response.json();
}

/**
 * Call the backend’s recommendation endpoint:
 * GET /api/seats/recommend?flightId=...&passengerCount=...&excluded=... etc.
 */
export async function getRecommendedSeat(options: {
  flightId: number;
  passengerCount: number;
  window: boolean;
  legroom: boolean;
  nearExit: boolean;
  excluded: string;
}): Promise<any[]> {
  const query = new URLSearchParams({
    flightId: options.flightId.toString(),
    passengerCount: options.passengerCount.toString(),
    window: options.window.toString(),
    legroom: options.legroom.toString(),
    nearExit: options.nearExit.toString(),
    excluded: options.excluded,
  });

  // Correct path: /api/seats/recommend
  const response = await fetch(`${BASE_URL}/recommend?${query.toString()}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch recommended seats: ${response.status}`);
  }
  return response.json();
}
