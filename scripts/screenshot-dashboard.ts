import { chromium } from 'playwright';

async function takeScreenshot() {
  const browser = await chromium.launch();

  // Desktop
  const desktopPage = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });

  await desktopPage.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle', timeout: 60000 });
  await desktopPage.waitForTimeout(3000);

  await desktopPage.screenshot({
    path: 'dashboard-desktop.jpg',
    quality: 40,
    type: 'jpeg',
    fullPage: true
  });

  await desktopPage.close();

  // Mobile
  const devices = (await import('playwright')).devices;
  const iPhone15 = devices['iPhone 15 Pro'];
  const mobilePage = await browser.newPage({
    ...iPhone15
  });

  await mobilePage.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle', timeout: 60000 });
  await mobilePage.waitForTimeout(3000);

  await mobilePage.screenshot({
    path: 'dashboard-mobile.jpg',
    quality: 40,
    type: 'jpeg',
    fullPage: true
  });

  await mobilePage.close();

  await browser.close();
  console.log('Dashboard screenshots saved!');
}

takeScreenshot().catch(console.error);
