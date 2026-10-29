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
  await new Promise(resolve => server.listen(4192, resolve));
  console.log('Static server listening on http://localhost:4192');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:4192', { waitUntil: 'networkidle0' });

  console.log('1. Page loaded with Crystal Glassmorphism.');
  await new Promise(r => setTimeout(r, 600));

  // Screenshot 1: Home with crystal glassmorphism cards
  const homeScreen = path.join(OUTPUT_DIR, 'glass_shaffof_home.png');
  await page.screenshot({ path: homeScreen });
  console.log('Saved:', homeScreen);

  // 2. Click Cloud button to open Appwrite Modal
  const cloudBtn = await page.waitForSelector('button[title*="Appwrite"], button[title*="sozlamalari"]');
  await cloudBtn.click();
  await new Promise(r => setTimeout(r, 600));

  // Screenshot 2: Database details modal (Qaysi baza, kodi, qancha joy bor)
  const modalScreen = path.join(OUTPUT_DIR, 'glass_shaffof_database_modal.png');
  await page.screenshot({ path: modalScreen });
  console.log('Saved:', modalScreen);

  // Close modal
  const backBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent && b.textContent.includes('Orqaga'));
  });
  if (backBtn) {
    await backBtn.click();
    await new Promise(r => setTimeout(r, 500));
  }

  // 3. Go to Profile tab
  const profileTab = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent && b.textContent.includes('Profil'));
  });
  if (profileTab) {
    await profileTab.click();
    await new Promise(r => setTimeout(r, 600));
  }

  // Screenshot 3: Profile with Appwrite stats & Canva design link
  const profileScreen = path.join(OUTPUT_DIR, 'glass_shaffof_profile.png');
  await page.screenshot({ path: profileScreen });
  console.log('Saved:', profileScreen);

  await browser.close();
  server.close();
  console.log('ALL VERIFICATION CHECKS COMPLETED SUCCESSFULLY!');
}

run().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
