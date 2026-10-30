const puppeteer = require('puppeteer-core');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = 'C:\\Users\\Owner\\.gemini\\antigravity\\brain\\0b8be24a-9947-4214-bcf6-936333801fb5';

async function testClearDemo() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  await page.goto('https://yuktop-pwa.vercel.app/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  // Go to Profile
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const profBtn = btns.find(b => b.textContent && b.textContent.includes('Profil'));
    if (profBtn) profBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Click Sinov yuklarni tozalash
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Sinov (demo) yuklarni tozalash'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // Click Ha, tozalansin
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Ha, tozalansin'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Go to E'lonlarim (Home)
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const homeBtn = btns.find(b => b.textContent && b.textContent.includes('E\'lonlarim'));
    if (homeBtn) homeBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: `${OUTPUT_DIR}\\live_clean_home_after_clear.png` });
  console.log('Saved live_clean_home_after_clear.png');

  await browser.close();
}

testClearDemo().catch(console.error);
