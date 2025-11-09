import { chromium } from 'playwright';

async function takeScreenshot() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });

  // Enable console logging
  page.on('console', msg => console.log('BROWSER:', msg.text()));

  await page.goto('http://localhost:3000/open-houses', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(8000); // Wait longer for async data

  await page.screenshot({
    path: 'open-houses-loaded.jpg',
    quality: 40,
    type: 'jpeg',
    fullPage: true
  });

  await browser.close();
  console.log('Screenshot saved to open-houses-loaded.jpg');
}

takeScreenshot().catch(console.error);
