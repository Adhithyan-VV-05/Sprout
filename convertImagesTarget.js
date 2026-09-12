const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function convertImagesToTargetRange() {
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
      const outputPath = path.join(dir, file.replace(/\.png$/, '.webp'));

      let width = 1050;
      let quality = 78;

      let buffer = await sharp(inputPath)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality, effort: 6 })
        .toBuffer();

      let sizeKb = buffer.length / 1024;

      // Binary search / step adjustment to fall strictly within 60KB - 90KB
      if (sizeKb > 90) {
        while (sizeKb > 90 && width > 720) {
          width -= 40;
          quality -= 2;
          buffer = await sharp(inputPath)
            .resize({ width, withoutEnlargement: true })
            .webp({ quality, effort: 6 })
            .toBuffer();
          sizeKb = buffer.length / 1024;
        }
      } else if (sizeKb < 60) {
        while (sizeKb < 60 && width < 1400 && quality < 92) {
          width += 50;
          quality += 3;
          buffer = await sharp(inputPath)
            .resize({ width, withoutEnlargement: true })
            .webp({ quality, effort: 6 })
            .toBuffer();
          sizeKb = buffer.length / 1024;
        }
      }

      fs.writeFileSync(outputPath, buffer);
      console.log(`[TARGET MATCH] ${file} -> ${file.replace(/\.png$/, '.webp')}: ${sizeKb.toFixed(1)} KB (Width: ${width}px, Quality: ${quality}%)`);
    }
  }
  console.log('ALL IMAGES COMPRESSED TO 60-90KB WEBP RANGE!');
}

convertImagesToTargetRange().catch(err => console.error(err));
