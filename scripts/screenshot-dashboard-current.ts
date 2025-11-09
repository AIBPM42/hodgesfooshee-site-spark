import { chromium } from 'playwright';

async function takeScreenshot() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });

  await page.goto('http://localhost:3001/dashboard', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(3000);

  await page.screenshot({
    path: 'dashboard-current-state.jpg',
    quality: 40,
    type: 'jpeg',
    fullPage: true
  });

  await browser.close();
  console.log('Current dashboard screenshot saved!');
}

takeScreenshot().catch(console.error);
