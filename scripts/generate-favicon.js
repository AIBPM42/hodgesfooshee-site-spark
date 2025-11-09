import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateFavicon() {
  const svgPath = path.join(__dirname, '..', 'public', 'favicon.svg');
  const icoPath = path.join(__dirname, '..', 'public', 'favicon.ico');

  try {
    // Read SVG file
    const svgBuffer = fs.readFileSync(svgPath);

    // Convert to PNG at 32x32 (ICO format)
    await sharp(svgBuffer)
      .resize(32, 32)
      .png()
      .toFile(icoPath);

    console.log('✅ Favicon generated successfully!');
    console.log(`   Created: ${icoPath}`);
  } catch (error) {
    console.error('❌ Error generating favicon:', error);
    process.exit(1);
  }
}

generateFavicon();
