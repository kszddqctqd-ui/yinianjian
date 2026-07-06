const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const urls = [
  'http://localhost:3001/',
  'http://localhost:3001/bazi',
  'http://localhost:3001/qifu',
  'http://localhost:3001/almanac',
  'http://localhost:3001/lottery',
  'http://localhost:3001/dream',
  'http://localhost:3001/divination',
  'http://localhost:3001/palmistry',
  'http://localhost:3001/naming',
  'http://localhost:3001/meditation',
  'http://localhost:3001/profile',
  'http://localhost:3001/more',
];

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--width=1920', '--height=1080'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  const outputDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  for (const url of urls) {
    try {
      const slug = url.replace(/http:\/\/localhost:3001\//, '').replace(/\//g, '_') || 'home';
      const filePath = path.join(outputDir, `${slug}_local.png`);
      console.log(`Capturing: ${url} -> ${filePath}`);
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await page.screenshot({ path: filePath, fullPage: false });
      console.log(`  ✓ Saved`);
    } catch (e) {
      console.error(`  ✗ Failed: ${url} - ${e.message}`);
    }
  }

  await browser.close();
  console.log('Done! Screenshots saved to', outputDir);
})();
