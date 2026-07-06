const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  // 1. 首页 - 完整提取所有交互元素
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });

  console.log('=== 1. 首页交互分析 ===');
  await page.goto('https://putiyuan.pages.dev/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  const homeInteractions = await page.evaluate(() => {
    const results = {};

    // 所有可点击元素
    const clickables = document.querySelectorAll('a, button, [role="button"], [onclick]');
    results.clickables = Array.from(clickables).map(el => ({
      tag: el.tagName,
      text: (el.textContent || '').trim().substring(0, 50),
      href: el.getAttribute('href') || el.getAttribute('onclick') || '',
      className: (el.className || '').toString().substring(0, 80),
    }));

    // 所有动画元素
    const animated = document.querySelectorAll('[style*="animation"], [class*="animat"]');
    results.animations = Array.from(animated).map(el => ({
      animation: el.style.animation || '',
      class: (el.className || '').toString().substring(0, 80),
    }));

    // 所有图片/图标
    const imgs = document.querySelectorAll('img, svg');
    results.media = Array.from(imgs).slice(0, 20).map(el => ({
      tag: el.tagName,
      src: el.src?.substring(0, 80) || '',
      className: (el.className || '').toString().substring(0, 60),
    }));

    // 所有表单
    const forms = document.querySelectorAll('form, input, textarea, select');
    results.forms = Array.from(forms).map(el => ({
      tag: el.tagName,
      type: el.type || '',
      name: el.name || '',
      placeholder: el.placeholder || '',
    }));

    return results;
  });

  console.log(`  Clickables: ${homeInteractions.clickables.length}`);
  console.log(`  Animations: ${homeInteractions.animations.length}`);
  console.log(`  Media: ${homeInteractions.media.length}`);
  console.log(`  Forms: ${homeInteractions.forms.length}`);

  // 2. 音乐功能
  console.log('\n=== 2. 音乐功能 ===');
  const musicBtn = await page.$('[class*="music"], [class*="audio"], [class*="sound"], [class*="bgm"], [aria-label*="music"]');
  if (musicBtn) {
    const musicInfo = await musicBtn.evaluate(el => {
      const cs = window.getComputedStyle(el);
      return {
        text: el.textContent?.trim(),
        className: el.className,
        bg: cs.backgroundColor,
        color: cs.color,
      };
    });
    console.log('  Found music element:', JSON.stringify(musicInfo, null, 2));
  } else {
    console.log('  No obvious music button found, searching all buttons...');
    const allBtns = await page.$$eval('button, [role="button"]', els =>
      els.map(el => ({
        text: el.textContent?.trim().substring(0, 30),
        className: (el.className || '').toString().substring(0, 60),
      }))
    );
    console.log('  All buttons:', JSON.stringify(allBtns, null, 2));
  }

  // Check for audio elements
  const audioEls = await page.$$eval('audio', els => els.map(a => ({
    src: a.src?.substring(0, 100),
    loop: a.loop,
    autoplay: a.autoplay,
  })));
  console.log('  Audio elements:', JSON.stringify(audioEls, null, 2));

  // 3. 手相/面相页面
  console.log('\n=== 3. 手相/面相页面 ===');
  await page.goto('https://putiyuan.pages.dev/palmistry/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  const palmistryInfo = await page.evaluate(() => {
    const results = {};

    // Title
    const title = document.querySelector('h1, h2, .title');
    if (title) results.title = title.textContent?.trim();

    // Upload area
    const uploadArea = document.querySelector('[class*="upload"], [class*="camera"], [class*="photo"], [class*="image"], [class*="scan"]');
    if (uploadArea) {
      results.uploadArea = {
        className: uploadArea.className,
        bg: window.getComputedStyle(uploadArea).backgroundColor,
        text: uploadArea.textContent?.trim().substring(0, 100),
      };
    }

    // All buttons
    const buttons = Array.from(document.querySelectorAll('button, [role="button"], a.btn')).map(el => ({
      text: el.textContent?.trim().substring(0, 50),
      className: (el.className || '').toString().substring(0, 80),
      href: el.getAttribute('href') || '',
    }));
    results.buttons = buttons;

    // Any camera/image related
    const cameraRelated = document.querySelectorAll('[class*="camera"], [class*="upload"], [class*="photo"], [class*="image"], [class*="scan"], [class*="face"], [class*="palm"]');
    results.cameraRelated = Array.from(cameraRelated).map(el => ({
      text: el.textContent?.trim().substring(0, 50),
      className: (el.className || '').toString().substring(0, 80),
      tagName: el.tagName,
    }));

    // Result area
    const resultArea = document.querySelector('[class*="result"], [class*="answer"], [class*="analysis"], [class*="reading"]');
    if (resultArea) {
      results.resultArea = {
        text: resultArea.textContent?.trim().substring(0, 200),
        className: (resultArea.className || '').toString().substring(0, 80),
      };
    }

    return results;
  });

  console.log('  Palmistry title:', palmistryInfo.title);
  console.log('  Upload area:', JSON.stringify(palmistryInfo.uploadArea, null, 2));
  console.log('  Camera related:', JSON.stringify(palmistryInfo.cameraRelated, null, 2));
  console.log('  Buttons:', JSON.stringify(palmistryInfo.buttons, null, 2));
  console.log('  Result area:', JSON.stringify(palmistryInfo.resultArea, null, 2));

  // 4. 祈福页面 - 灯的选择
  console.log('\n=== 4. 祈福灯选择 ===');
  await page.goto('https://putiyuan.pages.dev/qifu/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  const lampSelection = await page.evaluate(() => {
    // Find all lamp selection cards
    const cards = document.querySelectorAll('[class*="lamp"], [class*="light"], [class*="candle"], [class*="offer"]');
    return Array.from(cards).map(el => ({
      text: el.textContent?.trim().substring(0, 80),
      className: (el.className || '').toString().substring(0, 80),
      bg: window.getComputedStyle(el).backgroundColor,
    }));
  });
  console.log('  Lamp cards:', JSON.stringify(lampSelection, null, 2));

  await browser.close();
  console.log('\n=== DONE ===');
})();
