import { chromium } from 'playwright';

async function takeScreenshots() {
  const browser = await chromium.launch();

  // Desktop screenshot
  const desktopPage = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });
  await desktopPage.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await desktopPage.waitForTimeout(3000); // Wait for dynamic content
  await desktopPage.screenshot({
    path: 'homepage-desktop-audit.jpg',
    quality: 40,
    type: 'jpeg'
  });
  await desktopPage.close();

  // Mobile screenshot (iPhone 15)
  const devices = (await import('playwright')).devices;
  const iPhone15 = devices['iPhone 15 Pro'];
  const mobilePage = await browser.newPage({
    ...iPhone15
  });
  await mobilePage.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await mobilePage.waitForTimeout(3000);
  await mobilePage.screenshot({
    path: 'homepage-mobile-audit.jpg',
    quality: 40,
    type: 'jpeg'
  });
  await mobilePage.close();

  // Tablet screenshot (iPad Pro)
  const iPadPro = devices['iPad Pro'];
  const tabletPage = await browser.newPage({
    ...iPadPro
  });
  await tabletPage.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await tabletPage.waitForTimeout(3000);
  await tabletPage.screenshot({
    path: 'homepage-tablet-audit.jpg',
    quality: 40,
    type: 'jpeg'
  });
  await tabletPage.close();

  await browser.close();
  console.log('Screenshots captured successfully!');
}

takeScreenshots().catch(console.error);
