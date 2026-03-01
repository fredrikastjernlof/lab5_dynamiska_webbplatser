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


    //Testlog:

    topCourses.forEach(course => {
        console.log(`${course.name}: ${toNumber(course.applicantsTotal)} sökande`);
    });

    console.table(topCourses);

    topPrograms.forEach(program => {
        console.log(`${program.name}: ${toNumber(program.applicantsTotal)} sökande`);
    });

    console.table(topPrograms);



    // Stapeldiagram med "dummydata"
    const labelColors = ["#ff52ab", "#5be2a3", "#ec83bd", "#aa5584", "#20d380"];

    const barOptions = {
        series: [
            {
                data: [21, 22, 10, 28, 16, 21, 13, 30],
            },
        ],
        chart: {
            height: 350,
            type: "bar",
        },
        colors: labelColors,
        plotOptions: {
            bar: {
                columnWidth: "45%",
                distributed: true,
            },
        },
        dataLabels: { enabled: false },
        legend: { show: false },
        xaxis: {
            categories: [
                ["John", "Doe"],
                ["Joe", "Smith"],
                ["Jake", "Williams"],
                "Amber",
                ["Peter", "Brown"],
                ["Mary", "Evans"],
                ["David", "Wilson"],
                ["Lily", "Roberts"],
            ],
            labels: {
                style: {
                    colors: labelColors,
                    fontSize: "12px",
                },
            },
        },
    };

    const barEl = document.querySelector("#chart1");
    if (barEl) {
        const barChart = new ApexCharts(barEl, barOptions);
        barChart.render();
    }

    //Cirkeldiagram med "dummydata"

    const pieOptions = {
        series: [44, 55, 13, 43, 22],
        chart: {
            width: 380,
            type: "pie",
        },
        labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: { width: 200 },
                    legend: { position: "bottom" },
                },
            },
        ],
    };

    const pieEl = document.querySelector("#chart2");
    if (pieEl) {
        const pieChart = new ApexCharts(pieEl, pieOptions);
        pieChart.render();
    }

}

