const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'public', 'story');

async function convertMobImages() {
  const files = fs.readdirSync(srcDir).filter(f => f.includes('mob') && f.endsWith('.png'));
  
  for (const file of files) {
    const inputPath = path.join(srcDir, file);
    const baseName = file.replace('.png', '');
    const outputPath = path.join(srcDir, `${baseName}.webp`);
    
    console.log(`Converting: ${file} -> ${baseName}.webp`);
    
    await sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath);
    
    const stats = fs.statSync(outputPath);
    console.log(`  -> ${(stats.size / 1024).toFixed(0)}KB`);
  }
  
  console.log('\nAll mobile images converted!');
}

convertMobImages().catch(console.error);
