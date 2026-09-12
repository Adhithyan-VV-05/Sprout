const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function compress80Webp() {
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

      const metadata = await sharp(inputPath).metadata();
      let width = Math.min(metadata.width || 1920, 1920);
      let quality = 80;

      let buffer = await sharp(inputPath)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality, effort: 6 })
        .toBuffer();

      let sizeKb = buffer.length / 1024;

      // If file size exceeds 120 KB, cap at 120 KB maximum
      if (sizeKb > 120) {
        while (sizeKb > 120 && quality > 65) {
          quality -= 2;
          buffer = await sharp(inputPath)
            .resize({ width, withoutEnlargement: true })
            .webp({ quality, effort: 6 })
            .toBuffer();
          sizeKb = buffer.length / 1024;
        }

        if (sizeKb > 120) {
          width = 1600;
          buffer = await sharp(inputPath)
            .resize({ width, withoutEnlargement: true })
            .webp({ quality: 80, effort: 6 })
            .toBuffer();
          sizeKb = buffer.length / 1024;
        }
      }

      fs.writeFileSync(webpPath, buffer);
      console.log(`[CONVERTED 80%] ${file} -> ${file.replace(/\.png$/, '.webp')}: ${sizeKb.toFixed(1)} KB (Width: ${width}px, Quality: ${quality}%)`);
    }
  }
  console.log('All images converted to 80% quality WebP under 120 KB ceiling!');
}

compress80Webp().catch(console.error);
