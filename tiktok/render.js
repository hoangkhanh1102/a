// Dựng ảnh thẻ TikTok. Dùng: node render.js [file.html] [prefix]
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const src = process.argv[2] || 'task2-cards.html';
  const prefix = process.argv[3] || 'card';
  const file = 'file://' + path.resolve(__dirname, src);
  const outDir = path.resolve(__dirname, 'out');
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await page.goto(file, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  const cards = await page.$$('.card');
  for (let i = 0; i < cards.length; i++) {
    const name = `${prefix}-${String(i + 1).padStart(2, '0')}.png`;
    await cards[i].screenshot({ path: path.join(outDir, name) });
    console.log('->', name);
  }
  await browser.close();
})();
