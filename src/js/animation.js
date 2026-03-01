"use strict"

export function initCandyLab() {

    /* Hämtar nödvändiga classer och id:n */
    const sugarBtn = document.querySelector(".btn-sugar");
    const sprinkleZone = document.querySelector(".sprinkle-zone");
    const animationHeader = document.querySelector(".animation-header");
    const body = document.querySelector("body.page-animation");
    const bubbleLayer = document.querySelector(".bubble-layer");
    const candyStatus = document.querySelector("#candyStatus");

    /* Kör bara om elementen finns */
    if (!sugarBtn || !body) return;

    /* Funktion för att uppdatera status */
    function setStatus(message) {
        if (!candyStatus) return;

        const liEl = document.createElement("li");
        liEl.textContent = message;
        candyStatus.replaceChildren(liEl);
    }

    /* Funktion för att återställa status */
    function resetStatus() {
        if (!candyStatus) return;
        candyStatus.replaceChildren();
    }

    let mode = 0;

    sugarBtn.addEventListener("click", () => {
        mode = (mode + 1) % 4;

        animationHeader?.classList.remove("mode-1");
        body?.classList.remove("mode-2");
        bubbleLayer?.classList.remove("mode-2");
        sprinkleZone?.classList.remove("mode-3");

        if (mode >= 1) animationHeader?.classList.add("mode-1");
        if (mode >= 2) {
            body?.classList.add("mode-2");
            bubbleLayer?.classList.add("mode-2");
        }
        if (mode >= 3) sprinkleZone?.classList.add("mode-3");

        if (mode === 0) {
            resetStatus();
            sugarBtn.textContent = "Starta sockerrus!🍭";
        } else if (mode === 1) {
            setStatus("YES! Spana in headern - nu är vi igång 🙌");
            sugarBtn.textContent = "Nästa: bubblor!🫧";
        } else if (mode === 2) {
            setStatus("Schysst! Bubbligt värre - och spana in bodyn!🫧");
            sugarBtn.textContent = "Nästa: sprinkles!🍬";
        } else if (mode === 3) {
            setStatus("Woohoo!! 🥳 Du maxade Candy Lab! Tryck en gång till för att återställa!");
            sugarBtn.textContent = "Återställ 🔄";
        }
    });
}