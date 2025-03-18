import { fetchFlights } from "../api/flightsApi";

document.addEventListener("DOMContentLoaded", async () => {
    const flightsList = document.getElementById("flightsList");

    if (!flightsList) {
        console.error("❌ Flights list element not found in HTML.");
        return;
    }

    try {
        console.log("📡 Fetching flights from API...");
        const flights = await fetchFlights();
        console.log("✅ Flights received:", flights);

        if (!flights || flights.length === 0) {
            console.warn("⚠️ No flights available.");
            flightsList.innerHTML = "<li>No flights available.</li>";
            return;
        }

        flightsList.innerHTML = ""; // Clear previous content

        flights.forEach((flight: any) => {
            console.log("✈️ Adding flight:", flight);
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${flight.company}</strong>: ${flight.origin} → ${flight.destination} ($${flight.price})
                <br>
                <a href="flight.html?flightId=${flight.id}">View Seats</a>
            `;
            flightsList.appendChild(li);
        });
    } catch (error) {
        console.error("❌ Error fetching flights:", error);
        flightsList.innerHTML = `<li style="color: red;">Error loading flights. Check console.</li>`;
    }
});
