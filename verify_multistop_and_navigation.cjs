const puppeteer = require('puppeteer-core');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = 'C:\\Users\\Owner\\.gemini\\antigravity\\brain\\0b8be24a-9947-4214-bcf6-936333801fb5';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  console.log('1. Loading live Vercel PWA...');
  await page.goto('https://yuktop-pwa.vercel.app/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: `${OUTPUT_DIR}\\01_live_shipper_home.png` });
  console.log('Saved 01_live_shipper_home.png');

  console.log('2. Opening Post Cargo Modal...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Yangi yuk e\'lon qilish'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: `${OUTPUT_DIR}\\02_post_cargo_modal_open.png` });
  console.log('Saved 02_post_cargo_modal_open.png');

  console.log('3. Clicking "+ 3-manzilni qo\'shish"...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('3-manzilni qo\'shish'));
    if (btn) {
      btn.scrollIntoView({ behavior: 'instant', block: 'center' });
      btn.click();
    }
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: `${OUTPUT_DIR}\\03_post_cargo_multistop_3points.png` });
  console.log('Saved 03_post_cargo_multistop_3points.png');

  // Close modal
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const closeBtn = btns.find(b => b.title === 'Orqaga qaytish' || b.textContent.includes('Orqaga'));
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  console.log('4. Opening Cargo Detail modal to verify multi-stop & Yandex Navigator...');
  await page.evaluate(() => {
    const card = document.querySelector('.cursor-pointer');
    if (card) card.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: `${OUTPUT_DIR}\\04_cargo_detail_navigator.png` });
  console.log('Saved 04_cargo_detail_navigator.png');

  await browser.close();
  console.log('All screenshots captured successfully!');
}

run().catch(e => {
  console.error('Error:', e);
  process.exit(1);
});
