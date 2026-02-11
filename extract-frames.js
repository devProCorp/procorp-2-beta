
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputFile = 'videopWebp/Create_a_cinematic_202602111623_nd629-ezgif.com-video-to-webp-converter.webp';
const outputDir = 'web/public/hero-frames';

// Ensure output directory exists
if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir, { recursive: true });
}

async function extractFrames() {
  try {
    const metadata = await sharp(inputFile).metadata();
    console.log(`Processing ${metadata.pages} frames...`);

    if (!metadata.pages) {
        console.error("The image is not animated.");
        return;
    }

    for (let i = 0; i < metadata.pages; i++) {
      const outputName = `frame-${i.toString().padStart(4, '0')}.jpg`;
      const outputPath = path.join(outputDir, outputName);
      
      await sharp(inputFile, { page: i })
        .jpeg({ quality: 80 }) // Convert to JPEG for smaller file size than PNG
        .toFile(outputPath);
        
      if (i % 10 === 0) console.log(`Extracted frame ${i}`);
    }
    
    console.log('Done extraction.');
    // Create a JSON manifest of frames
    const frames = fs.readdirSync(outputDir).filter(f => f.endsWith('.jpg')).sort();
    fs.writeFileSync(path.join(outputDir, 'manifest.json'), JSON.stringify(frames));
    console.log('Manifest created.');
    
  } catch (error) {
    console.error("Error extracting frames:", error);
  }
}

extractFrames();
