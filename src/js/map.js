"use strict";

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
    form.addEventListener("submit", (event) => {
    event.preventDefault();

    const query = input.value.trim();

    console.log("Du klickade på SÖK!");
    console.log("Du sökte efter", query);

    status.textContent = `Du sökte på: ${query}`;
  });
}