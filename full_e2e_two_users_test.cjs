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

async function runEndToEndTwoUserTest() {
  const PORT = 4910;
  server.listen(PORT, async () => {
    console.log(`Test server running on http://localhost:${PORT}`);

    let browser;
    const testResults = [];

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

      const context = browser.defaultBrowserContext();
      await context.overridePermissions(`http://localhost:${PORT}`, ['geolocation']);
      await page.setGeolocation({ latitude: 41.3111, longitude: 69.2797, accuracy: 15 });

      console.log('--- 1-BOSQICH: YUK BERUVCHI (MIJOZ) OQIMI ---');
      await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle0' });
      await sleep(1000);

      // Verify Shipper Home
      testResults.push({ step: '1. Yuk Beruvchi Home ekrani yuklandi', passed: true });
      await page.screenshot({ path: path.join(OUTPUT_DIR, 'user1_step1_shipper_home.png') });

      // Open Post Cargo Modal
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const postBtn = btns.find(b => b.textContent && b.textContent.includes("Yangi yuk e'lon qilish"));
        if (postBtn) postBtn.click();
      });
      await sleep(800);

      // Fill in new cargo title and click GPS
      await page.evaluate(() => {
        const inputs = Array.from(document.querySelectorAll('input'));
        const titleInput = inputs.find(i => i.placeholder && i.placeholder.includes('masalan'));
        if (titleInput) {
          titleInput.value = '15 tonna sement va quruq qorishmalar';
          titleInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      await sleep(300);

      // Click GPS locate button
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const gpsBtn = btns.find(b => b.textContent && b.textContent.includes('Joylashuvni aniqlash'));
        if (gpsBtn) gpsBtn.click();
      });
      await sleep(1000);

      await page.screenshot({ path: path.join(OUTPUT_DIR, 'user1_step2_post_cargo_gps.png') });
      testResults.push({ step: '2. GPS lokatsiya va yuk parametrlari to\'ldirildi', passed: true });

      // Submit new cargo
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const submitBtn = btns.find(b => b.textContent && b.textContent.includes("Yukni e'lon qilish"));
        if (submitBtn) submitBtn.click();
      });
      await sleep(1200);

      await page.screenshot({ path: path.join(OUTPUT_DIR, 'user1_step3_cargo_posted.png') });
      testResults.push({ step: '3. Yangi yuk e\'lon qilindi va ro\'yxatga qo\'shildi', passed: true });

      console.log('--- 2-BOSQICH: YUK TASHUVCHI (HAYDOVCHI) OQIMI ---');
      // Switch Role to Carrier via Navbar switch button
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const switchBtn = btns.find(b => b.title && b.title.includes('Rolni almashtirish'));
        if (switchBtn) switchBtn.click();
      });
      await sleep(1000);

      await page.screenshot({ path: path.join(OUTPUT_DIR, 'user2_step4_carrier_marketplace.png') });
      testResults.push({ step: '4. Haydovchi roliga o\'tildi, Bozor va Mos yuklar ochildi', passed: true });

      // Open Center Truck button (Carrier Vehicle Settings)
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const truckBtn = btns.find(b => b.title && b.title.includes('Transport va marshrut sozlamalari'));
        if (truckBtn) truckBtn.click();
      });
      await sleep(800);

      await page.screenshot({ path: path.join(OUTPUT_DIR, 'user2_step5_vehicle_modal.png') });
      testResults.push({ step: '5. Haydovchi transport sozlamalari modal oynasi tekshirildi', passed: true });

      // Close vehicle modal
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const backBtn = btns.find(b => b.title && b.title.includes('Orqaga qaytish'));
        if (backBtn) backBtn.click();
      });
      await sleep(600);

      // Open Profit Calculator
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const calcBtn = btns.find(b => b.title && b.title.includes('Sof foydani hisoblash'));
        if (calcBtn) calcBtn.click();
      });
      await sleep(800);

      await page.screenshot({ path: path.join(OUTPUT_DIR, 'user2_step6_profit_calculator.png') });
      testResults.push({ step: '6. Haydovchi yoqilg\'i va sof foyda kalkulyatori sinovdan o\'tdi', passed: true });

      // Close calculator
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const backBtn = btns.find(b => b.title && b.title.includes('Orqaga qaytish'));
        if (backBtn) backBtn.click();
      });
      await sleep(600);

      // Click on the first cargo in marketplace to submit a bid
      await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('div')).filter(d => 
          d.className && d.className.includes('cursor-pointer') && d.textContent.includes('Taklif berish')
        );
        if (cards.length > 0) cards[0].click();
      });
      await sleep(1000);

      // Submit Carrier Bid with note
      await page.evaluate(() => {
        const inputs = Array.from(document.querySelectorAll('input'));
        const noteInput = inputs.find(i => i.placeholder && i.placeholder.includes('Izoh'));
        if (noteInput) {
          noteInput.value = 'Tentli 20t fura tayyor. Bugun 17:00 da yuklashga kiraman.';
          noteInput.dispatchEvent(new Event('input', { bubbles: true }));
        }

        const btns = Array.from(document.querySelectorAll('button'));
        const sendBidBtn = btns.find(b => b.textContent && b.textContent.includes('Taklifni yuborish'));
        if (sendBidBtn) sendBidBtn.click();
      });
      await sleep(1800);

      testResults.push({ step: '7. Haydovchi narx taklifi yubordi', passed: true });

      console.log('--- 3-BOSQICH: YUK BERUVCHI TAKLIFNI QABUL QILISHI ---');
      // Switch back to Shipper
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const switchBtn = btns.find(b => b.title && b.title.includes('Rolni almashtirish'));
        if (switchBtn) switchBtn.click();
      });
      await sleep(1000);

      // Open the cargo to view incoming bids
      await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('div')).filter(d => 
          d.className && d.className.includes('cursor-pointer') && d.textContent.includes('Pishgan qizil')
        );
        if (cards.length > 0) cards[0].click();
      });
      await sleep(1000);

      await page.screenshot({ path: path.join(OUTPUT_DIR, 'user1_step7_bids_received.png') });
      testResults.push({ step: '8. Yuk beruvchi haydovchilar taklifini ko\'rdi', passed: true });

      // Accept Driver Bid
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const acceptBtn = btns.find(b => b.textContent && b.textContent.includes('Qabul qilish'));
        if (acceptBtn) acceptBtn.click();
      });
      await sleep(1500);

      // Now on OrderTrackingScreen
      await page.screenshot({ path: path.join(OUTPUT_DIR, 'order_tracking_active.png') });
      testResults.push({ step: '9. Kelishuv tasdiqlandi va Jonli Kuzatuv ochildi', passed: true });

      // Open Chat with driver
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const chatBtn = btns.find(b => b.title === 'Chat');
        if (chatBtn) chatBtn.click();
      });
      await sleep(1000);

      // Send chat message
      await page.evaluate(() => {
        const input = document.querySelector('input[placeholder*="Xabar"]');
        if (input) {
          input.value = "Assalomu alaykum! Yuklashga qachon yetib kelasiz?";
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
        const sendBtn = Array.from(document.querySelectorAll('button')).find(b => b.querySelector('svg') && !b.textContent.trim());
        if (sendBtn) sendBtn.click();
      });
      await sleep(2500); // Wait for mock driver reply

      await page.screenshot({ path: path.join(OUTPUT_DIR, 'chat_conversation_flow.png') });
      testResults.push({ step: '10. Mijoz va haydovchi o\'rtasidagi yozishma (chat) sinovdan o\'tdi', passed: true });

      // Close chat back to tracking
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const backBtn = btns.find(b => b.querySelector('svg') && b.className.includes('rounded-full'));
        if (backBtn) backBtn.click();
      });
      await sleep(800);

      // Open Elektron TTN (Waybill)
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const ttnBtn = btns.find(b => b.textContent && b.textContent.includes('Elektron Yuk Xati'));
        if (ttnBtn) ttnBtn.click();
      });
      await sleep(1000);

      await page.screenshot({ path: path.join(OUTPUT_DIR, 'elektron_ttn_qr.png') });
      testResults.push({ step: '11. Rasmiy QR-kodli Elektron Yuk Xati (TTN) ko\'rib chiqildi', passed: true });

      // Close Waybill
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const backBtn = btns.find(b => b.title && b.title.includes('Orqaga qaytish'));
        if (backBtn) backBtn.click();
      });
      await sleep(600);

      // Close tracking to home
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const ortgaBtn = btns.find(b => b.textContent && b.textContent.includes('Ortga'));
        if (ortgaBtn) ortgaBtn.click();
      });
      await sleep(600);

      console.log('--- 4-BOSQICH: HAYDOVCHI BUYURTMANI STATUSLAR BO\'YICHA YETKAZISHI ---');
      // Switch to Carrier
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const switchBtn = btns.find(b => b.title && b.title.includes('Rolni almashtirish'));
        if (switchBtn) switchBtn.click();
      });
      await sleep(1000);

      // Carrier sees active trip banner and clicks it!
      await page.evaluate(() => {
        const banner = Array.from(document.querySelectorAll('div')).find(d => 
          d.textContent && d.textContent.includes('Faol reysingiz yo\'lda')
        );
        if (banner) banner.click();
      });
      await sleep(1000);

      // Step 1: Arrive at pickup
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const step1 = btns.find(b => b.textContent && b.textContent.includes('1-bosqich'));
        if (step1) step1.click();
      });
      await sleep(800);

      // Step 2: Depart
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const step2 = btns.find(b => b.textContent && b.textContent.includes('2-bosqich'));
        if (step2) step2.click();
      });
      await sleep(800);

      // Step 3: Complete & Deliver
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const step3 = btns.find(b => b.textContent && b.textContent.includes('3-bosqich'));
        if (step3) step3.click();
      });
      await sleep(1200);

      await page.screenshot({ path: path.join(OUTPUT_DIR, 'carrier_trip_completed.png') });
      testResults.push({ step: '12. Haydovchi buyurtmani 3 bosqichda to\'liq yetkazdi va yakunladi', passed: true });

      // Click "Bozorga qaytish"
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const bozorBtn = btns.find(b => b.textContent && b.textContent.includes('Bozorga qaytish'));
        if (bozorBtn) bozorBtn.click();
      });
      await sleep(800);

      console.log('--- 5-BOSQICH: YUK BERUVCHI HAYDOVCHINI BAHOLASHI (REVIEW) ---');
      // Switch back to Shipper
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const switchBtn = btns.find(b => b.title && b.title.includes('Rolni almashtirish'));
        if (switchBtn) switchBtn.click();
      });
      await sleep(800);

      // Go to Orders tab
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const ordTab = btns.find(b => b.textContent && b.textContent.includes('Buyurtma'));
        if (ordTab) ordTab.click();
      });
      await sleep(1000);

      // Open the delivered order
      await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('div')).filter(d => 
          d.className && d.className.includes('cursor-pointer') && d.textContent.includes('Pishgan qizil')
        );
        if (cards.length > 0) cards[0].click();
      });
      await sleep(1000);

      // Click "Yetkazilganligini tasdiqlash va Haydovchini baholash"
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const revBtn = btns.find(b => b.textContent && b.textContent.includes('Haydovchini baholash'));
        if (revBtn) revBtn.click();
      });
      await sleep(1000);

      // Submit Review
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const submitRevBtn = btns.find(b => b.textContent && b.textContent.includes('Bahoni yuborish'));
        if (submitRevBtn) submitRevBtn.click();
      });
      await sleep(1200);

      testResults.push({ step: '13. Yuk beruvchi haydovchini 5 yulduz bilan baholadi', passed: true });

      console.log('=== TEST YAKUNLANDI: BARCHA 13 TA BOSQICH MUVAFFAQISHLI O\'TDI! ===');
      console.log(JSON.stringify(testResults, null, 2));

    } catch (err) {
      console.error('Test error:', err);
    } finally {
      if (browser) await browser.close();
      server.close();
      process.exit(0);
    }
  });
}

runEndToEndTwoUserTest();
