document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("bookingsContainer")!;
    const bookingsJSON = sessionStorage.getItem("bookings");
  
    if (!bookingsJSON) {
      container.innerHTML = "<p>No bookings yet.</p>";
      return;
    }
  
    const bookings = JSON.parse(bookingsJSON);
    if (!bookings.length) {
      container.innerHTML = "<p>No bookings yet.</p>";
      return;
    }
  
    bookings.forEach((booking: any) => {
      // Create a “boarding pass” element with logo, details, divider, and barcode.
      const passDiv = document.createElement("div");
      passDiv.className = "boarding-pass";
  
      passDiv.innerHTML = `
      <div class="bp-header">
        <img src="/lennuki-logo.webp" alt="Plane Logo" class="bp-logo" />
        <h2>Boarding Pass</h2>
      </div>
      <div class="bp-details">
        <!-- Removed the "From" and "To" rows -->
        <div class="bp-row"><span class="label">Flight:</span><span class="value">${booking.flightTitle}</span></div>
        <div class="bp-row"><span class="label">Seat:</span><span class="value">${booking.seat}</span></div>
        <div class="bp-row"><span class="label">Departure:</span><span class="value">${booking.flightTime}</span></div>
        <div class="bp-row"><span class="label">Price:</span><span class="value">$${booking.flightPrice}</span></div>
      </div>
      <div class="bp-divider"></div>
      <div class="bp-footer">
        <span class="bp-timestamp">${booking.timestamp}</span>
        <img src="/barcode.avif" alt="Barcode" class="bp-barcode" />
      </div>
    `;
  
      container.appendChild(passDiv);
    });
  
    // “Back to Flights” button
    const backBtn = document.getElementById("backToFlights") as HTMLButtonElement;
    backBtn.addEventListener("click", () => {
      window.location.href = "flights.html";
    });
  });
  