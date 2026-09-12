const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generateVariants() {
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
      const baseName = file.replace(/\.png$/, '');

      // 1. Small (640px)
      const smPath = path.join(dir, `${baseName}-sm.webp`);
      await sharp(inputPath)
        .resize({ width: 640, withoutEnlargement: true })
        .webp({ quality: 75, effort: 6 })
        .toFile(smPath);

      // 2. Medium (1080px)
      const mdPath = path.join(dir, `${baseName}-md.webp`);
      await sharp(inputPath)
        .resize({ width: 1080, withoutEnlargement: true })
        .webp({ quality: 78, effort: 6 })
        .toFile(mdPath);

      // 3. Large (1920px)
      const lgPath = path.join(dir, `${baseName}.webp`);
      await sharp(inputPath)
        .resize({ width: 1920, withoutEnlargement: true })
        .webp({ quality: 80, effort: 6 })
        .toFile(lgPath);

      // 4. Ultra-light Blur Placeholder (40px)
      const blurPath = path.join(dir, `${baseName}-blur.webp`);
      await sharp(inputPath)
        .resize({ width: 40, withoutEnlargement: true })
        .webp({ quality: 20, effort: 4 })
        .toFile(blurPath);

      const smKb = (fs.statSync(smPath).size / 1024).toFixed(1);
      const mdKb = (fs.statSync(mdPath).size / 1024).toFixed(1);
      const lgKb = (fs.statSync(lgPath).size / 1024).toFixed(1);
      const blurKb = (fs.statSync(blurPath).size / 1024).toFixed(1);

      console.log(`[VARIANTS] ${baseName}: blur=${blurKb}KB, sm=${smKb}KB, md=${mdKb}KB, lg=${lgKb}KB`);
    }
  }
  console.log('All responsive image variants generated!');
}

generateVariants().catch(console.error);
