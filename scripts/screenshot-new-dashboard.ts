import { chromium } from 'playwright';

async function takeScreenshot() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });

  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(4000);

  await page.screenshot({
    path: 'dashboard-new.jpg',
    quality: 40,
    type: 'jpeg',
    fullPage: true
  });

  await browser.close();
  console.log('New dashboard screenshot saved!');
}

takeScreenshot().catch(console.error);
