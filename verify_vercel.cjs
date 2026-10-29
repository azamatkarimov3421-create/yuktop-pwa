const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUTPUT_DIR = 'C:\\Users\\Owner\\.gemini\\antigravity\\brain\\f2654a48-8ae8-40d6-af55-cab3b301e8a5\\screenshots';

const LIVE_URL = 'https://yuktop-pwa.vercel.app/';

async function testLiveVercel() {
  console.log(`Connecting to ${LIVE_URL}...`);
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 440, height: 960, deviceScaleFactor: 2 });

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', error => {
    consoleErrors.push(error.message);
  });

  await page.goto(LIVE_URL, { waitUntil: 'networkidle0' });
  console.log('Page loaded successfully on Vercel!');

  // Take screenshot of live splash
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'live_vercel_splash.png') });
  console.log('Saved live_vercel_splash.png');

  // Switch to Booking
  await page.evaluate(() => {
    if (window.setYuktopScreen) window.setYuktopScreen('booking');
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'live_vercel_booking.png') });
  console.log('Saved live_vercel_booking.png');

  // Switch to Tracking
  await page.evaluate(() => {
    if (window.setYuktopScreen) window.setYuktopScreen('tracking');
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'live_vercel_tracking.png') });
  console.log('Saved live_vercel_tracking.png');

  // Switch to Profile
  await page.evaluate(() => {
    if (window.setYuktopScreen) window.setYuktopScreen('profile');
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'live_vercel_profile.png') });
  console.log('Saved live_vercel_profile.png');

  await browser.close();

  console.log('Console Errors found on live site:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.log(consoleErrors);
  }
}

testLiveVercel().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
