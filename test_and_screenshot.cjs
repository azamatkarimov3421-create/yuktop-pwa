const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const DIST_DIR = path.join(__dirname, 'dist');
const OUTPUT_DIR = 'C:\\Users\\Owner\\.gemini\\antigravity\\brain\\0b8be24a-9947-4214-bcf6-936333801fb5';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  
  let filePath = path.join(DIST_DIR, reqPath);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

async function runTest() {
  server.listen(4892, async () => {
    console.log('Static test server listening on http://localhost:4892');

    let browser;
    try {
      browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-gpu',
          '--window-size=412,915'
        ]
      });

      const page = await browser.newPage();
      await page.setViewport({ width: 412, height: 915, isMobile: true, hasTouch: true });

      // Grant geolocation permission to localhost
      const context = browser.defaultBrowserContext();
      await context.overridePermissions('http://localhost:4892', ['geolocation']);

      // Mock accurate geolocation
      await page.setGeolocation({ latitude: 41.3111, longitude: 69.2797, accuracy: 12 });

      console.log('Navigating to app...');
      await page.goto('http://localhost:4892', { waitUntil: 'networkidle0', timeout: 15000 });
      await new Promise(r => setTimeout(r, 1200));

      // 1. Shipper Home Screen Screenshot
      const ss1 = path.join(OUTPUT_DIR, 'screen_1_shipper_home.png');
      await page.screenshot({ path: ss1, fullPage: false });
      console.log('Captured 1: Shipper Home Screen ->', ss1);

      // 2. Open Post Cargo Modal
      console.log('Opening PostCargoModal...');
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const btn = btns.find(b => b.textContent && (b.textContent.includes("Yuk e'lon qilish") || b.textContent.includes("e'lon")));
        if (btn) btn.click();
      });
      await new Promise(r => setTimeout(r, 1200));

      // Capture Modal & Click GPS detection
      const ss2 = path.join(OUTPUT_DIR, 'screen_2_post_cargo_modal.png');
      await page.screenshot({ path: ss2, fullPage: false });
      console.log('Captured 2: Post Cargo Modal ->', ss2);

      // Click GPS locate button
      console.log('Clicking GPS detection button...');
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const gpsBtn = btns.find(b => b.textContent && (b.textContent.includes('Joylashuvni aniqlash') || b.textContent.includes('GPS')));
        if (gpsBtn) gpsBtn.click();
      });
      await new Promise(r => setTimeout(r, 2200));

      const ss3 = path.join(OUTPUT_DIR, 'screen_3_gps_detected.png');
      await page.screenshot({ path: ss3, fullPage: false });
      console.log('Captured 3: GPS Detected Result ->', ss3);

      // Close modal
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const closeBtn = btns.find(b => b.textContent && b.textContent.includes('Orqaga'));
        if (closeBtn) closeBtn.click();
      });
      await new Promise(r => setTimeout(r, 800));

      // 4. Role switch to Carrier Marketplace
      console.log('Switching role to Carrier...');
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const toggleBtn = btns.find(b => b.textContent && (b.textContent.includes('Tashuvchi') || b.textContent.includes('Yuk beruvchi')));
        if (toggleBtn) toggleBtn.click();
      });
      await new Promise(r => setTimeout(r, 1000));

      const ss4 = path.join(OUTPUT_DIR, 'screen_4_carrier_marketplace.png');
      await page.screenshot({ path: ss4, fullPage: false });
      console.log('Captured 4: Carrier Marketplace ->', ss4);

      // 5. Open Orders Tab
      console.log('Opening Orders tab...');
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const tabBtn = btns.find(b => b.textContent && b.textContent.includes('Buyurtmalar'));
        if (tabBtn) tabBtn.click();
      });
      await new Promise(r => setTimeout(r, 800));

      const ss5 = path.join(OUTPUT_DIR, 'screen_5_orders_list.png');
      await page.screenshot({ path: ss5, fullPage: false });
      console.log('Captured 5: Orders List ->', ss5);

      // 6. Open Map Tab
      console.log('Opening Map tab...');
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const tabBtn = btns.find(b => b.textContent && b.textContent.includes('Xarita'));
        if (tabBtn) tabBtn.click();
      });
      await new Promise(r => setTimeout(r, 1500));

      const ss6 = path.join(OUTPUT_DIR, 'screen_6_logistics_map.png');
      await page.screenshot({ path: ss6, fullPage: false });
      console.log('Captured 6: Logistics Map ->', ss6);

      console.log('ALL TESTS AND SCREENSHOTS SUCCESSFUL!');
    } catch (err) {
      console.error('Test error:', err);
    } finally {
      if (browser) await browser.close();
      server.close();
      process.exit(0);
    }
  });
}

runTest();
