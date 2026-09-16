const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function processAll() {
  console.log('--- Processing Main Story Assets ---');
  
  const mainStoryDir = path.join(__dirname, 'main story');
  const publicMainStoryDir = path.join(__dirname, 'public/main-story');
  const publicStoryDir = path.join(__dirname, 'public/story');

  if (!fs.existsSync(publicMainStoryDir)) fs.mkdirSync(publicMainStoryDir, { recursive: true });
  if (!fs.existsSync(publicStoryDir)) fs.mkdirSync(publicStoryDir, { recursive: true });

  // 1. Process complete site.png and main bg.png
  const completeSitePath = path.join(mainStoryDir, 'complete site.png');
  if (fs.existsSync(completeSitePath)) {
    console.log('Copying complete site.png (lossless) -> public/main-story/complete-site.png...');
    fs.copyFileSync(completeSitePath, path.join(publicMainStoryDir, 'complete-site.png'));
    fs.copyFileSync(completeSitePath, path.join(publicMainStoryDir, 'complete site.png'));
    const csBuffer = await sharp(completeSitePath)
      .webp({ quality: 96, effort: 6 })
      .toBuffer();
    fs.writeFileSync(path.join(publicMainStoryDir, 'complete-site.webp'), csBuffer);
    console.log(`complete-site.webp created: ${(csBuffer.length / 1024).toFixed(1)} KB`);
  }

  const mainBgPath = path.join(mainStoryDir, 'main bg.png');
  if (fs.existsSync(mainBgPath)) {
    console.log('Optimizing main bg.png -> public/main-story/main-bg.webp...');
    const bgBuffer = await sharp(mainBgPath)
      .webp({ quality: 95, effort: 6 })
      .toBuffer();
    fs.writeFileSync(path.join(publicMainStoryDir, 'main-bg.webp'), bgBuffer);
    fs.copyFileSync(mainBgPath, path.join(publicMainStoryDir, 'main bg.png'));
    console.log(`main-bg.webp created: ${(bgBuffer.length / 1024).toFixed(1)} KB`);
  }

  // 2. Process story slides 1.png to 12.png
  for (let i = 1; i <= 12; i++) {
    const pngName = `${i}.png`;
    const inputPath = path.join(mainStoryDir, pngName);
    if (!fs.existsSync(inputPath)) {
      console.warn(`File not found: ${inputPath}`);
      continue;
    }

    // Direct copy png
    fs.copyFileSync(inputPath, path.join(publicStoryDir, pngName));

    // WebP full ultra quality 95
    const webpBuffer = await sharp(inputPath)
      .webp({ quality: 95, effort: 6 })
      .toBuffer();
    fs.writeFileSync(path.join(publicStoryDir, `${i}.webp`), webpBuffer);
    
    // Also generate pc and mob named variants for backward-compatibility if needed
    fs.writeFileSync(path.join(publicStoryDir, `${i} pc.webp`), webpBuffer);

    // Micro blur placeholder (tiny 24px)
    const blurBuffer = await sharp(inputPath)
      .resize(24, null, { fit: 'inside' })
      .webp({ quality: 20 })
      .toBuffer();
    fs.writeFileSync(path.join(publicStoryDir, `${i}-blur.webp`), blurBuffer);
    fs.writeFileSync(path.join(publicStoryDir, `${i} pc-blur.webp`), blurBuffer);

    console.log(`Slide ${i}: ${(webpBuffer.length / 1024).toFixed(1)} KB (WebP 95)`);
  }

  console.log('--- All assets processed successfully! ---');
}

processAll().catch(err => {
  console.error('Error processing assets:', err);
  process.exit(1);
});
