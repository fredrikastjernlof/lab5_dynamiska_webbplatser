# Laboration 5 – Dynamiska webbplatser 🌍📊

Detta repository innehåller vidareutvecklingen av webbplatsen SASSy Café, skapad som en del av momentet Dynamiska webbplatser i kursen Frontend-baserad webbutveckling.

Uppgiften bygger vidare på tidigare laborationer och har nu utökats med:

 - Datahämtning via FetchAPI
 - Visualisering av statistik i diagram
 - Kartfunktion med externt API
 - Dokumentation med JSDoc

## Syfte 🏁
Syftet med laborationen är att:

- Själv sätta mig in i nya tekniker
- Använda FetchAPI med async/await
- Visualisera data i olika typer av diagram
- Använda externt API
- Dokumentera JavaScript med JSDoc
- Publicera webbplats automatiskt via GitHub

## Tekniker 🧩
- Vite
- HTML, 
- SASS (SCSS)
- JavaScript
- Fetch API
- ApexCharts
- OpenStreetMap
- JSDoc
- Git & GitHub

## Funktionalitet

### Diagram 📊
På sidan Diagram hämtas ansökningsstatistik för höstterminen 2025 via FetchAPI från en extern JSON-källa.

- Stapeldiagram visar de 6 mest sökta kurserna och antal sökande
- Cirkeldiagram visar de 5 mest sökta programmen och antal sökande
- Diagrammen är implementerade med ApexCharts
- Diagrammen är responsiva och anpassade för dark/light-mode

### Karta 🌍
På sidan Karta kan användaren:

- Söka efter en plats via textfält
- Hämta sin aktuella information
- Se vald plats merkerad på kartan

Fetch-anrop sker till Open-Meteo Geocoding API och själva kartan är inbäddad via OpenStreeMaps.

## Publicering 💻

Webbplatsen är publicerad via Netlify:

https://lab5dynamiskawebbplatser.netlify.app/

## Dokumentation 📄

### Global översikt
https://lab5dynamiskawebbplatser.netlify.app/docs/index.html

### Karta
https://lab5dynamiskawebbplatser.netlify.app/docs/map.js.html

### Diagram
https://lab5dynamiskawebbplatser.netlify.app/docs/chart.js.html

## Det här tar jag med mig från uppgiften ✅🙌
Att jobba med diagrammen var faktiskt riktigt kul. Det är något speciellt med att hämta in data och sedan se den förvandlas till något visuellt direkt på sidan. Plötsligt känns det “på riktigt”. Jag gillar verkligen ApexCharts – det känns proffsigt utan att vara krångligt, och det var roligt att testa olika inställningar och se hur små ändringar kunde göra stor skillnad i hur allt uppfattas.

Kartdelen var också spännande, men lite mer utmanande. Jag fick verkligen känna på hur det är att jobba med externa API:er i praktiken – att saker inte alltid fungerar som man tänkt och att man ibland behöver justera sin lösning längs vägen. Det gjorde att jag fick felsöka, läsa på och tänka om, vilket i slutändan gav mig en bättre förståelse för hur allt hänger ihop.

Det jag framför allt tar med mig är:

- Att jag blivit tryggare med FetchAPI och async/await
- Att jag förstår bättre hur externa API:er fungerar i verkligheten
- Hur mycket det gör att faktiskt visualisera data istället för att bara visa siffror
- Att JSDoc faktiskt gör koden tydligare - både för andra och för mig själv (även om jag var skeptisk i början)
- Att problemlösning ofta handlar om att testa, tänka om och våga justera