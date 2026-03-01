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
        .sort(
            (a, b) => toNumber(b.applicantsTotal) - toNumber(a.applicantsTotal)
        )
        .slice(0, limit);
}

/**
 * Initierar diagrammen.
 * Hämtar statistikdata och skapar topplistor som
 * visas i ett stapel- och ett cirkeldiagram.
 *
 * @async
 * @returns {Promise<void>}
 */
export async function initCharts() {
    const page = document.querySelector("#chart-page");
    if (!page) return;

    const url = "https://mallarmiun.github.io/Frontend-baserad-webbutveckling/Moment%205%20-%20Dynamiska%20webbplatser/statistik_sokande_ht25.json";

    let data;

    //Hämtar statistikdata och fångar upp eventuella fel
    try {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Nätverksfel: ${res.status}`);
        }

        data = await res.json();

    } catch (error) {
        console.error("Ett fel uppstod vid hämtning av statistik:", error);
        return;
    }

    const topCourses = getTopByType(data, "Kurs", 6);
    const courseNames = topCourses.map((item) => item.name);
    const courseTotals = topCourses.map((item) => toNumber(item.applicantsTotal));

    const topPrograms = getTopByType(data, "Program", 5);
    const programNames = topPrograms.map((item) => item.name);
    const programTotals = topPrograms.map((item) => toNumber(item.applicantsTotal));



    /*-------------STAPELDIAGRAM-------------*/

    const labelColors = ["#faaf00", "#00aede", "#02c789", "#c2006b", "#c21414", "#003bde"];

    const barOptions = {
        title: {
            text: "Topp 6 mest sökta kurser HT25",
            style: {
            fontSize: "1.5rem"
            }
        },
        series: [
            {
                data: courseTotals,
            },
        ],
        chart: {
            type: "bar",
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
                fontSize: "1rem"
            }
        },
        legend: { show: false },
        xaxis: {
            categories: courseNames.map(name => {
                if (name.includes("beteendeterapi")) {
                    return [
                        "Introduktion till beteendeterapi och",
                        "kognitiv beteendeterapi (KBT)"
                    ];
                }
                return name;
            }),
            labels: {
                rotate: -20,
                style: {
                    colors: labelColors,
                    fontSize: "0.75rem",
                },
            },
        },
    };

    const barEl = document.querySelector("#chart1");
    if (barEl) {
        const barChart = new ApexCharts(barEl, barOptions);
        barChart.render();
    }



    /*-------------CIRKELDIAGRAM-------------*/

    const pieOptions = {
        title: {
            text: "Topp 5 mest sökta program HT25",
            style: {
            fontSize: "1.5rem"
            }
        },
        series: programTotals,
        chart: {
            type: "pie",
        },
        labels: programNames,
        colors: labelColors.slice(0, 5),
        dataLabels: {
            formatter: function (val, opts) {
                return opts.w.config.series[opts.seriesIndex];
            },
            style: {
                fontSize: "1rem",
                fontWeight: "600"
            },
        },
    };

    const pieEl = document.querySelector("#chart2");
    if (pieEl) {
        const pieChart = new ApexCharts(pieEl, pieOptions);
        pieChart.render();
    }
}

