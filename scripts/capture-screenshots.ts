import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const urls = [
  { url: 'http://localhost:3001/', name: 'home' },
  { url: 'http://localhost:3001/qifu/', name: 'qifu' },
  { url: 'http://localhost:3001/almanac/', name: 'almanac' },
  { url: 'http://localhost:3001/lottery/', name: 'lottery' },
  { url: 'http://localhost:3001/dream/', name: 'dream' },
  { url: 'http://localhost:3001/palmistry/', name: 'palmistry' },
  { url: 'http://localhost:3001/naming/', name: 'naming' },
  { url: 'http://localhost:3001/divination/', name: 'divination' },
  { url: 'http://localhost:3001/meditation/', name: 'meditation' },
  { url: 'http://localhost:3001/profile/', name: 'profile' },
  { url: 'http://localhost:3001/more/', name: 'more' },
  { url: 'http://localhost:3001/records/', name: 'records' },
  { url: 'http://localhost:3001/ziwei/', name: 'ziwei' },
];

(async () => {
  const outDir = path.join(__dirname, '..', 'screenshots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  for (const { url, name } of urls) {
    try {
      console.log(`Capturing: ${name} (${url})`);
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, 1500)); // let animations render
      const filePath = path.join(outDir, `${name}.png`);
      await page.screenshot({ path: filePath, fullPage: false });
      console.log(`  -> saved ${filePath}`);
    } catch (err) {
      console.error(`  -> FAILED ${name}: ${(err as Error).message}`);
    }
  }

  // Also capture mobile view
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  for (const { url, name } of urls.slice(0, 3)) {
    try {
      console.log(`Mobile: ${name} (${url})`);
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, 1500));
      const filePath = path.join(outDir, `${name}-mobile.png`);
      await page.screenshot({ path: filePath, fullPage: false });
      console.log(`  -> saved ${filePath}`);
    } catch (err) {
      console.error(`  -> FAILED mobile ${name}: ${(err as Error).message}`);
    }
  }

  await browser.close();
  console.log('\nDone! Screenshots saved to', outDir);
})();
