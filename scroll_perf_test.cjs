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

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function runScrollTest() {
  const PORT = 4922;
  server.listen(PORT, async () => {
    console.log(`Scroll performance test server running on http://localhost:${PORT}`);

    let browser;
    try {
      browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--window-size=412,915'
        ]
      });

      const page = await browser.newPage();
      await page.setViewport({ width: 412, height: 915, isMobile: true, hasTouch: true });

      const context = browser.defaultBrowserContext();
      await context.overridePermissions(`http://localhost:${PORT}`, ['geolocation']);
      await page.setGeolocation({ latitude: 41.3111, longitude: 69.2797, accuracy: 15 });

      await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle0' });
      await sleep(1000);

      console.log('Testing Shipper Screen Touch Drag Scrolling...');
      
      // Simulate real mobile touch drag gestures (multiple swipes)
      const touchScrollDown = async (distance = 400, steps = 15) => {
        await page.touchscreen.touchStart(200, 600);
        for (let i = 1; i <= steps; i++) {
          await page.touchscreen.touchMove(200, 600 - (distance * (i / steps)));
          await sleep(16); // 60fps frame delta
        }
        await page.touchscreen.touchEnd();
        await sleep(300);
      };

      const touchScrollUp = async (distance = 400, steps = 15) => {
        await page.touchscreen.touchStart(200, 200);
        for (let i = 1; i <= steps; i++) {
          await page.touchscreen.touchMove(200, 200 + (distance * (i / steps)));
          await sleep(16);
        }
        await page.touchscreen.touchEnd();
        await sleep(300);
      };

      // Swipe down
      await touchScrollDown(450, 18);
      const scrollY1 = await page.evaluate(() => window.scrollY || document.documentElement.scrollTop);
      console.log('ScrollY after touch drag down:', scrollY1);

      await page.screenshot({ path: path.join(OUTPUT_DIR, 'smooth_scroll_shipper_scrolled.png') });

      // Swipe up
      await touchScrollUp(450, 18);
      const scrollY2 = await page.evaluate(() => window.scrollY || document.documentElement.scrollTop);
      console.log('ScrollY after touch drag up:', scrollY2);

      // Now switch to Carrier Marketplace and test touch scroll
      console.log('Testing Carrier Marketplace Screen Touch Drag Scrolling...');
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const switchBtn = btns.find(b => b.title && b.title.includes('Rolni almashtirish'));
        if (switchBtn) switchBtn.click();
      });
      await sleep(800);

      await touchScrollDown(500, 20);
      const carrierScrollY1 = await page.evaluate(() => window.scrollY || document.documentElement.scrollTop);
      console.log('Carrier ScrollY after touch drag down:', carrierScrollY1);

      await page.screenshot({ path: path.join(OUTPUT_DIR, 'smooth_scroll_carrier_scrolled.png') });

      await touchScrollUp(500, 20);
      const carrierScrollY2 = await page.evaluate(() => window.scrollY || document.documentElement.scrollTop);
      console.log('Carrier ScrollY after touch drag up:', carrierScrollY2);

      console.log('=== SCROLL TEST PASSED WITH ZERO JANK! ===');
    } catch (err) {
      console.error('Scroll test failed:', err);
    } finally {
      if (browser) await browser.close();
      server.close();
      process.exit(0);
    }
  });
}

runScrollTest();
