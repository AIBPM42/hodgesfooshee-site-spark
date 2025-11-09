/**
 * Generate hero images for county pages
 * Uses the existing /api/hero endpoint to create PNG images, then converts to optimized JPG
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const counties = [
  {
    name: 'Davidson County',
    slug: 'davidson-county',
    tagline: 'The Heart of Music City — Where Culture Meets Opportunity',
    lat: 36.1627,
    lng: -86.7816
  },
  {
    name: 'Williamson County',
    slug: 'williamson-county',
    tagline: 'Luxury Living & Top Schools Near Nashville',
    lat: 35.9179,
    lng: -86.8622
  },
  {
    name: 'Rutherford County',
    slug: 'rutherford-county',
    tagline: 'Where Affordability Meets Opportunity in Middle Tennessee',
    lat: 35.8456,
    lng: -86.3903
  },
  {
    name: 'Wilson County',
    slug: 'wilson-county',
    tagline: 'Small Town Charm Meets Big City Access',
    lat: 36.1834,
    lng: -86.2936
  },
  {
    name: 'Sumner County',
    slug: 'sumner-county',
    tagline: 'Where Community and Growth Go Hand in Hand',
    lat: 36.4659,
    lng: -86.4500
  },
  {
    name: 'Cheatham County',
    slug: 'cheatham-county',
    tagline: 'Rural Beauty, Urban Convenience',
    lat: 36.2695,
    lng: -87.0753
  },
  {
    name: 'Dickson County',
    slug: 'dickson-county',
    tagline: 'Quality of Life at an Affordable Price',
    lat: 36.0770,
    lng: -87.3878
  },
  {
    name: 'Maury County',
    slug: 'maury-county',
    tagline: 'Historic Charm, Modern Opportunity',
    lat: 35.6145,
    lng: -87.0336
  },
  {
    name: 'Robertson County',
    slug: 'robertson-county',
    tagline: 'Growing Together, Building Strong',
    lat: 36.5220,
    lng: -86.8778
  }
];

const PORT = 3000;
const publicDir = path.join(__dirname, '..', 'public', 'counties');

// Ensure counties directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

async function generateImage(county) {
  const url = new URL(`http://localhost:${PORT}/api/hero`);
  url.searchParams.set('county', county.name);
  url.searchParams.set('tagline', county.tagline);
  url.searchParams.set('lat', county.lat.toString());
  url.searchParams.set('lng', county.lng.toString());

  console.log(`Generating image for ${county.name}...`);
  console.log(`URL: ${url.toString()}`);

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    const outputPath = path.join(publicDir, `${county.slug}-hero.jpg`);

    // Convert PNG to optimized JPG
    await sharp(Buffer.from(buffer))
      .jpeg({ quality: 85, progressive: true })
      .toFile(outputPath);

    const stats = fs.statSync(outputPath);
    console.log(`✓ Saved: ${outputPath}`);
    console.log(`  Size: ${(stats.size / 1024).toFixed(2)} KB\n`);

    return true;
  } catch (error) {
    console.error(`✗ Failed to generate ${county.name}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('County Hero Image Generator');
  console.log('='.repeat(60));
  console.log(`Output directory: ${publicDir}\n`);

  let successCount = 0;

  for (const county of counties) {
    const success = await generateImage(county);
    if (success) successCount++;
  }

  console.log('='.repeat(60));
  console.log(`Complete: ${successCount}/${counties.length} images generated`);
  console.log('='.repeat(60));
}

main().catch(console.error);
