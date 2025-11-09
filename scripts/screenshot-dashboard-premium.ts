import { chromium } from 'playwright';

async function takeScreenshots() {
  const browser = await chromium.launch();

  // Light mode screenshot
  const lightPage = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });

  await lightPage.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle', timeout: 60000 });
  await lightPage.waitForTimeout(5000);

  await lightPage.screenshot({
    path: 'dashboard-premium-light.jpg',
    quality: 40,
    type: 'jpeg',
    fullPage: true
  });

  // Dark mode screenshot
  const darkPage = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });

  await darkPage.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle', timeout: 60000 });
  await darkPage.waitForTimeout(3000);

  // Click the dark mode toggle in the header
  await darkPage.click('header button');
  await darkPage.waitForTimeout(3000);

  await darkPage.screenshot({
    path: 'dashboard-premium-dark.jpg',
    quality: 40,
    type: 'jpeg',
    fullPage: true
  });

  await browser.close();
  console.log('Premium dashboard screenshots saved!');
}

takeScreenshots().catch(console.error);
