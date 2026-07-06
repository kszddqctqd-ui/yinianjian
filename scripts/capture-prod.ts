import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const urls = [
  { url: 'https://yinianjian-src.vercel.app/', name: 'home' },
  { url: 'https://yinianjian-src.vercel.app/qifu/', name: 'qifu' },
  { url: 'https://yinianjian-src.vercel.app/almanac/', name: 'almanac' },
  { url: 'https://yinianjian-src.vercel.app/lottery/', name: 'lottery' },
  { url: 'https://yinianjian-src.vercel.app/dream/', name: 'dream' },
  { url: 'https://yinianjian-src.vercel.app/palmistry/', name: 'palmistry' },
  { url: 'https://yinianjian-src.vercel.app/naming/', name: 'naming' },
  { url: 'https://yinianjian-src.vercel.app/divination/', name: 'divination' },
  { url: 'https://yinianjian-src.vercel.app/meditation/', name: 'meditation' },
  { url: 'https://yinianjian-src.vercel.app/profile/', name: 'profile' },
  { url: 'https://yinianjian-src.vercel.app/more/', name: 'more' },
  { url: 'https://yinianjian-src.vercel.app/records/', name: 'records' },
  { url: 'https://yinianjian-src.vercel.app/ziwei/', name: 'ziwei' },
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
      await new Promise(r => setTimeout(r, 2000));
      const filePath = path.join(outDir, `${name}.png`);
      await page.screenshot({ path: filePath, fullPage: false });
      console.log(`  -> saved ${filePath}`);
    } catch (err) {
      console.error(`  -> FAILED ${name}: ${(err as Error).message}`);
    }
  }

  // Mobile views
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  for (const { url, name } of urls.slice(0, 5)) {
    try {
      console.log(`Mobile: ${name} (${url})`);
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, 2000));
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
