// testPuppeteer.js
const puppeteer = require('puppeteer'); // ⛔ puppeteer-core 아님!

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://example.com');
  console.log('✅ Example.com loaded successfully');
  await browser.close();
})();
