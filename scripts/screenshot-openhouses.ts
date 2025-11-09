import { chromium } from 'playwright';

async function takeScreenshot() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });

  await page.goto('http://localhost:3000/open-houses', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000); // Wait for dynamic content

  await page.screenshot({
    path: 'open-houses-latest.jpg',
    quality: 40,
    type: 'jpeg',
    fullPage: true
  });

  await browser.close();
  console.log('Screenshot saved to open-houses-latest.jpg');
}

takeScreenshot().catch(console.error);
