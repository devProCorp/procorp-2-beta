
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Update paths relative to where the script is run (web/)
const inputFile = path.join(__dirname, '../videopWebp/Create_a_cinematic_202602111623_nd629-ezgif.com-video-to-webp-converter.webp');
const outputDir = path.join(__dirname, 'public/hero-frames');

console.log(`Input: ${inputFile}`);
console.log(`Output: ${outputDir}`);

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function extractFrames() {
    try {
        const start = Date.now();
        console.log('Reading metadata...');
        const metadata = await sharp(inputFile).metadata();

        if (!metadata.pages) {
            console.error("The image is not animated (no pages found).");
            return;
        }

        console.log(`Found ${metadata.pages} frames. Extracting...`);

        // Process in batches to avoid memory issues if many frames
        const batchSize = 10;
        for (let i = 0; i < metadata.pages; i += batchSize) {
            const promises = [];
            for (let j = 0; j < batchSize && (i + j) < metadata.pages; j++) {
                const pageIdx = i + j;
                const outputName = `frame-${pageIdx.toString().padStart(4, '0')}.jpg`;
                const outputPath = path.join(outputDir, outputName);

                promises.push(
                    sharp(inputFile, { page: pageIdx })
                        .jpeg({ quality: 80, mozjpeg: true })
                        .resize({ width: 1920, withoutEnlargement: true }) // optimize size
                        .toFile(outputPath)
                        .then(() => {
                            if (pageIdx % 10 === 0) process.stdout.write('.');
                        })
                );
            }
            await Promise.all(promises);
        }

        console.log(`\nDone extraction in ${(Date.now() - start) / 1000}s.`);

        // Create a JSON manifest of frames for the frontend to consume
        const frames = fs.readdirSync(outputDir)
            .filter(f => f.endsWith('.jpg') && f.startsWith('frame-'))
            .sort();

        fs.writeFileSync(path.join(outputDir, 'manifest.json'), JSON.stringify(frames));
        console.log(`Manifest created with ${frames.length} frames.`);

    } catch (error) {
        console.error("Error extracting frames:", error);
    }
}

extractFrames();
