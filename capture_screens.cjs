const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUTPUT_DIR = 'C:\\Users\\Owner\\.gemini\\antigravity\\brain\\f2654a48-8ae8-40d6-af55-cab3b301e8a5\\screenshots';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const screens = [
  { id: 'splash', name: '1_splash_welcome.png' },
  { id: 'booking', name: '2_cargo_booking.png' },
  { id: 'trucks', name: '3_truck_selection.png' },
  { id: 'tracking', name: '4_realtime_tracking.png' },
  { id: 'driver', name: '5_driver_profile.png' },
  { id: 'bookings', name: '6_my_bookings.png' },
  { id: 'earnings', name: '7_earnings_analytics.png' },
  { id: 'profile', name: '8_profile_settings.png' },
];

async function capture() {
  console.log('Launching Edge browser...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 440, height: 960, deviceScaleFactor: 2 });

  console.log('Navigating to http://localhost:4173...');
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle0' });

  for (const screen of screens) {
    console.log(`Setting screen directly via API: ${screen.id}...`);
    await page.evaluate((targetScreen) => {
      if (window.setYuktopScreen) {
        window.setYuktopScreen(targetScreen);
      }
    }, screen.id);

    // Wait for animations and map rendering
    await new Promise(r => setTimeout(r, 1200));

    const outputPath = path.join(OUTPUT_DIR, screen.name);
    await page.screenshot({ path: outputPath });
    console.log(`Saved screenshot: ${screen.name}`);
  }

  await browser.close();
  console.log('All 8 screen captures completed successfully!');
}

capture().catch(err => {
  console.error('Capture failed:', err);
  process.exit(1);
});
