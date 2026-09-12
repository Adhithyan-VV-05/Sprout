const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function fineTune() {
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

      let stat = fs.statSync(webpPath);
      let sizeKb = stat.size / 1024;

      if (sizeKb > 90 || sizeKb < 60) {
        let width = 900;
        let quality = 72;

        let buffer = await sharp(inputPath)
          .resize({ width, withoutEnlargement: true })
          .webp({ quality, effort: 6 })
          .toBuffer();

        sizeKb = buffer.length / 1024;

        while (sizeKb > 90 && width > 500) {
          width -= 30;
          quality -= 2;
          buffer = await sharp(inputPath)
            .resize({ width, withoutEnlargement: true })
            .webp({ quality, effort: 6 })
            .toBuffer();
          sizeKb = buffer.length / 1024;
        }

        fs.writeFileSync(webpPath, buffer);
        console.log(`[FINE-TUNED] ${file} -> ${sizeKb.toFixed(1)} KB (Width: ${width}px, Quality: ${quality}%)`);
      }
    }
  }
}

fineTune().catch(console.error);
