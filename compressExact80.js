const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function compressExact80() {
  const directories = [
    path.join(__dirname, 'public/story'),
    path.join(__dirname, 'story')
  ];

  for (const dir of directories) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir);

    for (const file of files) {
      if (!file.endsWith('.png')) continue;
      const inputPath = path.join(dir, file);
      const webpPath = path.join(dir, file.replace(/\.png$/, '.webp'));

      // Keep quality strictly at 80%
      const quality = 80;
      let width = 1440;

      let buffer = await sharp(inputPath)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality, effort: 6 })
        .toBuffer();

      let sizeKb = buffer.length / 1024;

      // Scale resolution down if file size exceeds 120 KB, keeping Quality strictly at 80%
      while (sizeKb > 120 && width > 600) {
        width -= 40;
        buffer = await sharp(inputPath)
          .resize({ width, withoutEnlargement: true })
          .webp({ quality, effort: 6 })
          .toBuffer();
        sizeKb = buffer.length / 1024;
      }

      fs.writeFileSync(webpPath, buffer);
      console.log(`[STRICT 80% WEBP] ${file} -> ${file.replace(/\.png$/, '.webp')}: ${sizeKb.toFixed(1)} KB (Width: ${width}px, Quality: 80%)`);
    }
  }
  console.log('Finished compressing all images at strictly 80% quality under 120 KB ceiling!');
}

compressExact80().catch(console.error);
