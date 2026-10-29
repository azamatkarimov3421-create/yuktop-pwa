const puppeteer = require('puppeteer-core');
const path = require('path');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = 'C:\\Users\\Owner\\.gemini\\antigravity\\brain\\0b8be24a-9947-4214-bcf6-936333801fb5';

async function checkLiveWithCloudData() {
  console.log('Connecting to https://yuktop-pwa.vercel.app/ ...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('https://yuktop-pwa.vercel.app/', { waitUntil: 'networkidle0' });
  
  // Wait for Appwrite sync
  await new Promise(r => setTimeout(r, 2000));
  
  const screenshotPath = path.join(OUTPUT_DIR, 'live_vercel_appwrite_synced.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Saved screenshot:', screenshotPath);
  
  // Check if our cloud cargo appears
  const pageText = await page.evaluate(() => document.body.innerText);
  const foundCargo = pageText.includes('Qurilish mollari') || pageText.includes('Samarqand');
  console.log('Cloud Cargo visible in UI:', foundCargo);
  
  await browser.close();
}

checkLiveWithCloudData().catch(console.error);
