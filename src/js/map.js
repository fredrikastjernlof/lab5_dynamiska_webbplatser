"use strict";

// Funktion för att hämta lat/lon för plats
async function geocodePlace(query) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        query
    )}&count=1&language=sv&format=json`;

    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Nätverksfel: ${res.status}`);
    }

    const data = await res.json();

    if (!data.results || data.results.length === 0) {
        throw new Error("Ingen plats hittades.");
    }

    const place = data.results[0];

    return {
        lat: place.latitude,
        lon: place.longitude,
        name: place.name,
    };
}

// Funktion för att hämta "min position"
function getMyPosition() {
    return new Promise((resolve, reject) => {
        if (!("geolocation" in navigator)) {
            reject(new Error("Geolocation stöds inte i din webbläsare."));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                resolve({
                    lat: pos.coords.latitude,
                    lon: pos.coords.longitude,
                });
            },
            (err) => {
                reject(err);
            }
        );
    });
}

//Uppdatera kartan
function updateMap(frame, lat, lon) {
    const delta = 0.01;
    const left = lon - delta;
    const right = lon + delta;
    const bottom = lat - delta;
    const top = lat + delta;

    frame.src = `https://www.openstreetmap.org/export/embed.html?bbox=${left},${bottom},${right},${top}&layer=mapnik&marker=${lat},${lon}`;
}

// Initierar kart-sidan och hämtar DOM-element
export function initMap() {
    const page = document.querySelector("#map-page");
    if (!page) return;

    const form = document.querySelector("#map-form");
    const input = document.querySelector("#place");
    const status = document.querySelector("#map-status");
    const frame = document.querySelector("#map-frame");
    const myBtn = document.querySelector("#my-location");

    //Lägger till eventlyssnare och status-text
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const query = input.value.trim();
        if (!query) return;

        console.log("Du klickade på SÖK. Du sökte på:", query);
        status.textContent = "Söker plats...";

        try {
            const result = await geocodePlace(query);
            console.log("Sökresultat:", result);

            updateMap(frame, result.lat, result.lon);
            status.textContent = `Visar: ${result.name}`;

        } catch (error) {
            console.error("Fel vid sökning:", error);
            status.textContent = "Kunde inte hitta platsen.";
        }
    });

//Eventlyssnare för "min position"
    myBtn.addEventListener("click", async () => {
        status.textContent = "Hämtar din position...";

        // Rensa input 
        input.value = "";

        try {
            const pos = await getMyPosition();
            console.log("Min position:", pos);

            updateMap(frame, pos.lat, pos.lon);
            status.textContent = `Din position: ${pos.lat.toFixed(5)}, ${pos.lon.toFixed(5)}`;
        } catch (error) {
            console.error("Fel vi sökning:", error);
            status.textContent = "Kunde inte hämta din position.";
        }
    });
}