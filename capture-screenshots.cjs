const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const urls = [
  'https://putiyuan.pages.dev/',
  'https://putiyuan.pages.dev/bazi',
  'https://putiyuan.pages.dev/qifu',
  'https://putiyuan.pages.dev/almanac',
  'https://putiyuan.pages.dev/lottery',
  'https://putiyuan.pages.dev/dream',
  'https://putiyuan.pages.dev/divination',
  'https://putiyuan.pages.dev/palmistry',
  'https://putiyuan.pages.dev/naming',
  'https://putiyuan.pages.dev/meditation',
  'https://putiyuan.pages.dev/profile',
  'https://putiyuan.pages.dev/more',
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
      const slug = url.replace(/https?:\/\//, '').replace(/\//g, '_');
      const filePath = path.join(outputDir, `${slug}_desktop.png`);
      console.log(`Capturing: ${url} -> ${filePath}`);
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await page.evaluate(() => { document.documentElement.style.fontSize = '16px'; });
      await page.screenshot({ path: filePath, fullPage: false });
      await new Promise(r => setTimeout(r, 1000));
    } catch (e) {
      console.error(`Failed: ${url} - ${e.message}`);
    }
  }

  // Mobile screenshots (375x812)
  await page.setViewport({ width: 375, height: 812 });
  for (const url of urls) {
    try {
      const slug = url.replace(/https?:\/\//, '').replace(/\//g, '_');
      const filePath = path.join(outputDir, `${slug}_mobile.png`);
      console.log(`Mobile: ${url} -> ${filePath}`);
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await page.screenshot({ path: filePath, fullPage: false });
      await new Promise(r => setTimeout(r, 1000));
    } catch (e) {
      console.error(`Mobile failed: ${url} - ${e.message}`);
    }
  }

  await browser.close();
  console.log('Done! Screenshots saved to', outputDir);
})();
