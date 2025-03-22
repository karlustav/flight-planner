// document.addEventListener("DOMContentLoaded", function () {
//     fetch("http://localhost:8080/api/flights")
//         .then(response => response.json())
//         .then(data => {
//             console.log("data", data)
//             const flightList = document.getElementById("flights");
//             data.forEach(flight => {
//                 let li = document.createElement("li");
//                 li.textContent = flight;
//                 flightList.appendChild(li);
//             });
//         })
//         .catch(error => console.error("Error fetching flights:", error));
// });

function loadFlights() {
    fetch("http://localhost:8080/api/flights")
        .then(response => response.json())
        .then(data => {
            console.log("data", data);
            const flightList = document.getElementById("flights-list");
            flightList.innerHTML = "";

            data.forEach(flight => {
                let li = document.createElement("li");
                li.textContent = flight.from + '-' + flight.to;
                flightList.appendChild(li);
            });
        })
        .catch(error => console.error("Error fetching flights:", error));
}
