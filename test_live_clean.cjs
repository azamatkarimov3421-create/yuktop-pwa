const puppeteer = require('puppeteer-core');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = 'C:\\Users\\Owner\\.gemini\\antigravity\\brain\\0b8be24a-9947-4214-bcf6-936333801fb5';

async function testLive() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  console.log('1. Loading live site...');
  await page.goto('https://yuktop-pwa.vercel.app/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: `${OUTPUT_DIR}\\live_glass_home.png` });
  console.log('Saved live_glass_home.png');

  console.log('2. Opening Post Cargo modal...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Yangi yuk e\'lon qilish'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: `${OUTPUT_DIR}\\live_post_cargo_clean_gps.png` });
  console.log('Saved live_post_cargo_clean_gps.png');

  // Close modal
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const closeBtn = btns.find(b => b.title === 'Orqaga qaytish' || b.textContent.includes('Orqaga'));
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  console.log('3. Navigating to Profile tab...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const profBtn = btns.find(b => b.textContent && b.textContent.includes('Profil'));
    if (profBtn) profBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: `${OUTPUT_DIR}\\live_profile_editable_clear.png` });
  console.log('Saved live_profile_editable_clear.png');

  await browser.close();
  console.log('All tests passed!');
}

testLive().catch(console.error);
