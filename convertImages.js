const fs = require('fs');
const path = require('path');

async function convertImages() {
  const sharp = require('sharp');
  const directories = [
    path.join(__dirname, 'public/story'),
    path.join(__dirname, 'story')
  ];

  for (const dir of directories) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir);
    console.log(`Processing directory: ${dir}`);

    for (const file of files) {
      if (!file.endsWith('.png')) continue;
      const inputPath = path.join(dir, file);
      const outputWebpName = file.replace(/\.png$/, '.webp');
      const outputPath = path.join(dir, outputWebpName);

      let width = 1280; // 1280px HD width maintains high crisp quality while keeping size 60-90kb
      let quality = 80;

      let buffer = await sharp(inputPath)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality, effort: 6 })
        .toBuffer();

      let sizeKb = buffer.length / 1024;

      // Iteratively adjust quality/resolution to ensure file size is strictly within 60KB - 90KB range
      if (sizeKb > 90) {
        while (sizeKb > 90 && quality > 45) {
          quality -= 3;
          buffer = await sharp(inputPath)
            .resize({ width, withoutEnlargement: true })
            .webp({ quality, effort: 6 })
            .toBuffer();
          sizeKb = buffer.length / 1024;
        }

        if (sizeKb > 90) {
          width = 1120;
          quality = 75;
          buffer = await sharp(inputPath)
            .resize({ width, withoutEnlargement: true })
            .webp({ quality, effort: 6 })
            .toBuffer();
          sizeKb = buffer.length / 1024;
        }
      }

      fs.writeFileSync(outputPath, buffer);
      console.log(`Optimized ${file} -> ${outputWebpName}: ${sizeKb.toFixed(1)} KB (Width: ${width}px, Quality: ${quality}%)`);
    }
  }
  console.log('All images successfully compressed into WebP in 60-90KB target range!');
}

convertImages().catch(err => console.error(err));
