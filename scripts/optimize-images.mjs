/* Script för bildoptimering som läser original från src/images/original 
och skriver optimerade webp till public/images */

/* Importerar sharp och Node-moduler som används
för att läsa mappar och optimera bilder */
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

/* Absoluta sökvägar till in- och utmappar */
const inputDir = path.resolve("src/images/original");
const outputDir = path.resolve("public/images");

/* Skapar en mapp om den inte redan finns */
async function ensureDir(dir) {
    await fs.mkdir(dir, { recursive: true });
}

/* Skapar mappen public/images om den saknas, läser alla bildfiler och optimerar dem */
async function run() {
    await ensureDir(outputDir);

    /* Hämtar lista med filnamn i orginalmappen*/
    const files = await fs.readdir(inputDir);

    /* Loopar genom varje bildfil */
    for (const file of files) {
        const inputPath = path.join(inputDir, file);

        /* Plockar ut filnamn utan ändelse */
        const fileName = path.parse(file).name;

        /* Avgör om bilden är en headerbild baserat på filnamnet */
        const isHeader = fileName.toLowerCase().startsWith("header");

        /* Skapar nytt filnamn med .webp */
        const outputName = fileName + ".webp";
        const outputPath = path.join(outputDir, outputName);

        /* Olika inställningar beroende på bildtyp */
        const width = isHeader ? 1600 : 900;
        const quality = isHeader ? 80 : 70;

        /* Konverterar bilderna till WebP och sparar dem */
        await sharp(inputPath)
            .resize({ width, withoutEnlargement: true })
            .webp({ quality })
            .toFile(outputPath);
    }
}

/* Kör scriptet och fångar eventuella fel */
run().catch((err) => {
    console.error("Fel i scriptet:", err);
    process.exit(1);
});
