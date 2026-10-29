const puppeteer = require('puppeteer-core');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = 'C:\\Users\\Owner\\.gemini\\antigravity\\brain\\0b8be24a-9947-4214-bcf6-936333801fb5';

async function check() {
  console.log('Connecting to https://yuktop-pwa.vercel.app/ ...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('https://yuktop-pwa.vercel.app/', { waitUntil: 'networkidle0' });
  
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: OUTPUT_DIR + '\\live_vercel_appwrite.png' });
  console.log('Saved live_vercel_appwrite.png');
  
  // Check if Appwrite / Cloud button is present
  const cloudBtn = await page.$('button[title*="Appwrite"], button[title*="sozlamalari"]');
  console.log('Cloud button present on Vercel:', !!cloudBtn);
  
  if (cloudBtn) {
    await cloudBtn.click();
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: OUTPUT_DIR + '\\live_vercel_modal.png' });
    console.log('Saved live_vercel_modal.png');
  }
  
  await browser.close();
  console.log('Vercel live verification completed successfully!');
}

check().catch(e => {
  console.error('Verification error:', e);
  process.exit(1);
});
