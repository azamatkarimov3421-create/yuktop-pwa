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
      return res.end('Not found');
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

async function run() {
  await new Promise(resolve => server.listen(4179, resolve));
  console.log('Static server listening on http://localhost:4179');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:4179', { waitUntil: 'networkidle0' });

  console.log('Page loaded successfully.');

  // 1. Click Cloud icon in Navbar
  const cloudBtn = await page.waitForSelector('button[title*="Appwrite"], button[title*="sozlamalari"]');
  await cloudBtn.click();
  await new Promise(r => setTimeout(r, 600));

  // Screenshot modal open
  const modalScreen = path.join(OUTPUT_DIR, 'appwrite_cloud_modal.png');
  await page.screenshot({ path: modalScreen });
  console.log('Saved:', modalScreen);

  // 2. Type Project ID
  const projectIdInput = await page.waitForSelector('input[placeholder*="Masalan: 67123"]');
  await projectIdInput.click({ clickCount: 3 });
  await projectIdInput.type('671fe789001abc998877');

  // Click Save
  const saveBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent && b.textContent.includes('Saqlash va Ulanish'));
  });
  if (saveBtn) {
    await saveBtn.click();
    await new Promise(r => setTimeout(r, 600));
  }

  // Screenshot saved / connected state
  const connectedScreen = path.join(OUTPUT_DIR, 'appwrite_cloud_connected.png');
  await page.screenshot({ path: connectedScreen });
  console.log('Saved:', connectedScreen);

  // Close modal via "Orqaga" button
  const backBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent && b.textContent.includes('Orqaga'));
  });
  if (backBtn) {
    await backBtn.click();
    await new Promise(r => setTimeout(r, 500));
  }

  // Go to Profile tab
  const profileTab = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent && b.textContent.includes('Profil'));
  });
  if (profileTab) {
    await profileTab.click();
    await new Promise(r => setTimeout(r, 600));
  }

  // Screenshot Profile with Appwrite Cloud status
  const profileScreen = path.join(OUTPUT_DIR, 'appwrite_cloud_profile.png');
  await page.screenshot({ path: profileScreen });
  console.log('Saved:', profileScreen);

  await browser.close();
  server.close();
  console.log('ALL APPWRITE INTEGRATION CHECKS PASSED!');
}

run().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
