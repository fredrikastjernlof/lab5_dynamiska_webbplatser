"use strict";

/**
 * Konverterar en sträng till ett nummer.
 * Tar bort eventuella mellanslag i början och slutet med hjälp av trim.
 *
 * @param {string|number} value - Värde att konvertera.
 * @returns {number} Konverterat nummer.
 */
function toNumber(value) {
    return Number(String(value).trim());
}

/**
 * Tar fram en topplista från statistikdata.
 * Filtrerar på typ (kurs eller program),
 * sorterar på antal sökande (fallande),
 * och returnerar ett visst antal resultat.
 *
 * @param {Array} data - Lista med statistikobjekt.
 * @param {string} type - "Kurs" eller "Program".
 * @param {number} limit - Antal resultat som ska returneras.
 * @returns {Array} En lista med de mest sökta objekten.
 */
function getTopByType(data, type, limit) {
    return data
        .filter((item) => item.type === type)
        .sort((a, b) => toNumber(b.applicantsTotal) - toNumber(a.applicantsTotal))
        .slice(0, limit);
}

/**
 * Initierar diagrammen på sidan
 * Hämtar statistikdata, skapar ett stapeldiagram och ett cirkeldiagram med ApexCharts,
 * och synkar textfärger mot sidans aktuella tema (light/dark) genom att lyssna på prefers-color-scheme.
 *
 * @async
 * @returns {Promise<void>}
 */
export async function initCharts() {
    // Kontrollerar om sidan finns 
    const page = document.querySelector("#chart-page");
    if (!page) return;

    let barChart = null;
    let pieChart = null;


    /**
     * Hämtar aktuell textfärg som styrs av min SCSS / dark-theme
     *
     * @returns {{ textColor: string, isDark: boolean }}
     */
    function getThemeState() {
        // Om #chart-page inte har en egen färg, ta färgen från närmsta container eller body
        const baseEl = page.closest(".main") || document.body;

        return {
            textColor: getComputedStyle(baseEl).color,
            isDark: window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false,
        };
    }

    /**
     * Uppdaterar textfärg beroende av dark/light-mode
     *
     * @returns {void}
     */
    function applyChartTheme() {
        const { textColor, isDark } = getThemeState();

        barChart?.updateOptions(
            {
                foreColor: textColor,
                title: { style: { color: textColor } },
                tooltip: { theme: isDark ? "dark" : "light" },
            },
            false,
            true
        );

        pieChart?.updateOptions(
            {
                foreColor: textColor,
                title: { style: { color: textColor } },
                legend: { labels: { colors: textColor } },
                tooltip: { theme: isDark ? "dark" : "light" },
            },
            false,
            true
        );
    }

    // Hämtar data till diagrammen
    const url =
        "https://mallarmiun.github.io/Frontend-baserad-webbutveckling/Moment%205%20-%20Dynamiska%20webbplatser/statistik_sokande_ht25.json";

    let data;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Nätverksfel: ${res.status}`);
        data = await res.json();
    } catch (error) {
        console.error("Ett fel uppstod vid hämtning av statistik:", error);
        return;
    }

    // Skapar variabler för data
    const topCourses = getTopByType(data, "Kurs", 6);
    const courseNames = topCourses.map((item) => item.name);
    const courseTotals = topCourses.map((item) => toNumber(item.applicantsTotal));

    const topPrograms = getTopByType(data, "Program", 5);
    const programNames = topPrograms.map((item) => item.name);
    const programTotals = topPrograms.map((item) => toNumber(item.applicantsTotal));

    //För dark/light-mode
    const { textColor, isDark } = getThemeState();



    /*--------------------STAPELDIAGRAM--------------------*/

    const labelColors = ["#faaf00", "#00aede", "#02c789", "#c2006b", "#c21414", "#003bde"];

    const barOptions = {
        title: {
            text: "Topp 6 mest sökta kurser HT25",
            offsetY: 15,
            style: {
                fontSize: "1.5rem",
                color: textColor,
            },
        },
        foreColor: textColor,
        tooltip: { theme: isDark ? "dark" : "light" },

        series: [{ data: courseTotals }],

        chart: {
            type: "bar",
            height: 420,
            width: "100%",
        },
        grid: {
            padding: {
                top: 30,
            },
        },
        colors: labelColors,
        plotOptions: {
            bar: {
                columnWidth: "45%",
                distributed: true,
            },
        },
        dataLabels: {
            enabled: true,
            style: {
                fontSize: "1rem",
            },
        },
        legend: { show: false },
        xaxis: {
            categories: courseNames.map((name) => {
                if (name.includes("beteendeterapi")) {
                    return [
                        "Introduktion till beteendeterapi och",
                        "kognitiv beteendeterapi (KBT)",
                    ];
                }
                return name;
            }),
            labels: {
                rotate: -30,
                style: {
                    colors: labelColors,
                    fontSize: "0.9rem",
                },
            },
        },
        responsive: [
            {
                breakpoint: 600,
                options: {
                    chart: {
                        height: 320
                    },
                    title: {
                        text: [
                            "Topp 6 mest sökta",
                            "kurser HT25"
                        ],
                        style: {
                            fontSize: "1.1rem"
                        }
                    },
                    xaxis: {
                        labels: {
                            rotate: -60,
                            style: {
                                fontSize: "12px"
                            }
                        }
                    },
                    dataLabels: {
                        style: {
                            fontSize: "12px"
                        }
                    },
                    plotOptions: {
                        bar: {
                            columnWidth: "60%",
                            dataLabels: {
                                orientation: "vertical"
                            }
                        }
                    }
                }
            }
        ]
    };

    const barEl = document.querySelector("#chart1");
    if (barEl) {
        barChart = new ApexCharts(barEl, barOptions);
        await barChart.render();
    }


    /*--------------------CIRKELDIAGRAM--------------------*/

    const pieOptions = {
        title: {
            text: "Topp 5 mest sökta program HT25",
            offsetY: 15,
            style: {
                fontSize: "1.5rem",
                color: textColor,
            },
        },
        series: programTotals,
        chart: {
            type: "pie",
            height: 420,
            width: "100%",
        },
        grid: {
            padding: {
                top: 30,
            },
        },
        labels: programNames,
        foreColor: textColor,
        legend: {
            fontSize: "0.9rem",
            labels: {
                colors: textColor,
            },
        },
        colors: labelColors.slice(0, 5),
        dataLabels: {
            formatter: function (val, opts) {
                return opts.w.config.series[opts.seriesIndex];
            },
            style: {
                fontSize: "1rem",
                fontWeight: "600",
                colors: ["#fff"],
            },
        },
        tooltip: {
            theme: isDark ? "dark" : "light"
        },
        responsive: [
            {
                breakpoint: 600,
                options: {
                    chart: {
                        height: 400
                    },
                    title: {
                        text: [
                            "Topp 5 mest sökta",
                            "program HT25",
                        ],
                        style: {
                            fontSize: "1.1rem"
                        }
                    },
                    legend: {
                        position: "bottom",
                        fontSize: "12px"
                    },
                    dataLabels: {
                        style: {
                            fontSize: "12px",
                            colors: ["#fff"]
                        }
                    }
                }
            }
        ]
    };

    const pieEl = document.querySelector("#chart2");
    if (pieEl) {
        pieChart = new ApexCharts(pieEl, pieOptions);
        await pieChart.render();
    }


    //Synka när användaren byter mellan light/dark-mode

    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // Kör en gång direkt efter render
    requestAnimationFrame(applyChartTheme);

    /**
     * Uppdaterar diagrammens textfärg när användaren byter mellan light/dark mode.
     *
     * @returns {void}
     */
    function onThemeChange() {
        requestAnimationFrame(applyChartTheme);
    }

    darkModeQuery.addEventListener("change", onThemeChange);
}