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

    console.log("Form:", form);
    console.log("Input:", input);
    console.log("Status:", status);
    console.log("Iframe:", frame);
    console.log("Min position-knapp:", myBtn);
}