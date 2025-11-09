import { chromium } from 'playwright';

async function takeScreenshot() {
  const browser = await chromium.launch();

  // Desktop
  const desktopPage = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });

  await desktopPage.goto('http://localhost:3000/dashboard/agent', { waitUntil: 'networkidle', timeout: 60000 });
  await desktopPage.waitForTimeout(4000); // Wait for data to load

  await desktopPage.screenshot({
    path: 'agent-dashboard-desktop.jpg',
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

  await mobilePage.goto('http://localhost:3000/dashboard/agent', { waitUntil: 'networkidle', timeout: 60000 });
  await mobilePage.waitForTimeout(4000);

  await mobilePage.screenshot({
    path: 'agent-dashboard-mobile.jpg',
    quality: 40,
    type: 'jpeg',
    fullPage: true
  });

  await mobilePage.close();

  await browser.close();
  console.log('Agent dashboard screenshots saved!');
}

takeScreenshot().catch(console.error);
