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

            status.textContent = `Hittade: ${result.name} (${result.lat}, ${result.lon})`;
        } catch (error) {
            console.error("Fel vid sökning:", error);
            status.textContent = "Kunde inte hitta platsen.";
        }
    });
}