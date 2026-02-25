"use strict";
import "../styles/main.scss";

/* Hämtar nödvändiga classer och id:n för Candy-Lab-funktioner*/
const sugarBtn = document.querySelector(".btn-sugar");
const sprinkleZone = document.querySelector(".sprinkle-zone");
const animationHeader = document.querySelector(".animation-header");
const body = document.querySelector("body.page-animation");
const bubbleLayer = document.querySelector(".bubble-layer");
const candyStatus = document.querySelector("#candyStatus")

/* Funktion för att uppdatera status på vilket läge knappen befinner sig i */
function setStatus(message) {
    if (!candyStatus) /* Avsluta om candyStatus ej finns */
        return;

    /* Skapar nytt <li> element  som ska hålla mitt statusmeddelande */
    const liEl = document.createElement("li")
    liEl.textContent = message;
    candyStatus.replaceChildren(liEl);
}

/* Funktion för att återställa status */
function resetStatus() {
    if (!candyStatus)
        return;

    candyStatus.replaceChildren();
}

/* Håller koll på vilket läge knappen är i: 0=av, 1-3=effekter */
let mode = 0;

/* Kapslar in Candy Lab istället för att ha den löst i filen */
function initCandyLab() {
    /* Kör bara om elementen faktiskt finns på sidan */
    if (!sugarBtn || !body)
        return;

    sugarBtn.addEventListener("click", () => {
        mode = (mode + 1) % 4;

        /* Efter 3 lägen: reset (stäng av allt) */
        animationHeader?.classList.remove("mode-1");
        body?.classList.remove("mode-2");
        bubbleLayer?.classList.remove("mode-2");
        sprinkleZone?.classList.remove("mode-3");

        if (mode >= 1) {
            animationHeader?.classList.add("mode-1");

        }
        if (mode >= 2) {
            body?.classList.add("mode-2");
            bubbleLayer?.classList.add("mode-2");
        }
        if (mode >= 3) {
            sprinkleZone?.classList.add("mode-3");
        }


        /* Olika statusmeddelande för knappens lägen */
        if (mode === 0) {
            resetStatus();
            sugarBtn.textContent = "Starta sockerrus!🍭";
        } else if (mode === 1) {
            setStatus("YES! Spana in headern - nu är vi igång 🙌");
            sugarBtn.textContent = "Nästa: bubblor!🫧";
        } else if (mode === 2) {
            setStatus("Schysst! Bubbligt värre - och spana in bodyn!🫧");
            sugarBtn.textContent = "Nästa: sprinkles!🍬 ";
        } else if (mode === 3) {
            setStatus("Woohoo!! 🥳 Du maxade Candy Lab! Tryck en gång till för att återställa!")
            sugarBtn.textContent = "Återställ 🔄";
        }

    });
}

/* Anropar funktionen CandyLab */
initCandyLab();


