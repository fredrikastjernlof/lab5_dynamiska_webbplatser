"use strict";

/**
 * En position med latitud och longitud.
 * @typedef {Object} Position
 * @property {number} lat Latitud.
 * @property {number} lon Longitud.
 */

/**
 * Hämtar lat/lon för en plats som användaren skriver in.
 * Här används ett externt API (Open-Meteo Geocoding) som returnerar koordinater.
 * @param {string} query Plats att söka efter till exempel en ort.
 * @returns {Promise<{lat:number, lon:number, name:string}>} Ett objekt med koordinater och namn.
 */
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
        lat: Number(place.latitude),
        lon: Number(place.longitude),
        name: place.name,
    };
}

/**
 * Hämtar användarens aktuella position via webbläsaren.
 * @returns {Promise<Position>} Ett objekt med lat/lon.
 */
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

/**
 * Uppdaterar kartan så att den visar rätt område och en markör.
 * @param {HTMLIFrameElement} frame Iframe-elementet där kartan visas.
 * @param {number} lat Latitud.
 * @param {number} lon Longitud.
 * @param {number} [delta=0.01] Hur mycket kartan ska zooma (mindre värde = mer inzoomat).
 * @returns {void}
 */
function updateMap(frame, lat, lon, delta = 0.01) {
    const left = lon - delta;
    const right = lon + delta;
    const bottom = lat - delta;
    const top = lat + delta;

    frame.src = `https://www.openstreetmap.org/export/embed.html?bbox=${left},${bottom},${right},${top}&layer=mapnik&marker=${lat},${lon}`;
}

/**
 * Startar allt som hör till kart-sidan.
 * Kopplar formuläret (sök) och knappen (min position) till rätt funktioner.
 * @returns {void}
 */
export function initMap() {
    const page = document.querySelector("#map-page");
    if (!page) return;

    const form = document.querySelector("#map-form");
    const input = document.querySelector("#place");
    const status = document.querySelector("#map-status");
    const frame = document.querySelector("#map-frame");
    const myBtn = document.querySelector("#my-location");

    // Om något saknas ska inte koden krascha
    if (!form || !input || !status || !frame) {
        console.error("Map: Saknar ett eller flera DOM-element.");
        return;
    }

    // Sök plats
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const query = input.value.trim();
        if (!query) return;

        status.textContent = "Söker plats...";

        try {
            const result = await geocodePlace(query);
            updateMap(frame, result.lat, result.lon);
            status.textContent = `Visar: ${result.name}`;
            input.value = "";
        } catch (error) {
            console.error("Fel vid sökning:", error);
            status.textContent = "Kunde inte hitta platsen.";
        }
    });

    // Sök efter "min position" 
    if (myBtn) {
        myBtn.addEventListener("click", async () => {
            status.textContent = "Hämtar din position...";
            input.value = "";

            try {
                const pos = await getMyPosition();
                updateMap(frame, pos.lat, pos.lon, 0.005);
                status.textContent = `Din position: ${pos.lat.toFixed(5)}, ${pos.lon.toFixed(
                    5
                )}`;
            } catch (error) {
                console.error("Fel vid geolocation:", error);
                status.textContent = "Kunde inte hämta din position.";
            }
        });
    }
}