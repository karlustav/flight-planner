// Get button and output elements from the DOM
const fetchSeatsBtn = document.getElementById('fetchSeatsBtn');
const seatsOutput = document.getElementById('seatsOutput');

const recommendSeatBtn = document.getElementById('recommendSeatBtn');
const recommendedSeatOutput = document.getElementById('recommendedSeatOutput');

// Define the base URL for your backend
const backendUrl = 'http://localhost:8080';

if (fetchSeatsBtn) {
  fetchSeatsBtn.addEventListener('click', async () => {
    try {
      const response = await fetch(`${backendUrl}/seats`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const seats = await response.json();
      // Display the seats in a preformatted text block
      seatsOutput!.innerHTML = `<pre>${JSON.stringify(seats, null, 2)}</pre>`;
    } catch (error) {
      seatsOutput!.innerText = `Error fetching seats: ${error}`;
    }
  });
}

if (recommendSeatBtn) {
  recommendSeatBtn.addEventListener('click', async () => {
    try {
      // For example, fetching a recommended seat with the 'window' parameter set to true
      const response = await fetch(`${backendUrl}/seats/recommend?window=true`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const seat = await response.json();
      recommendedSeatOutput!.innerHTML = `<pre>${JSON.stringify(seat, null, 2)}</pre>`;
    } catch (error) {
      recommendedSeatOutput!.innerText = `Error fetching recommended seat: ${error}`;
    }
  });
}
