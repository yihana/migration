// ② extractBlogContent_puppeteer.js

const puppeteer = require('puppeteer');

async function extractBlogContent(url) {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    // 네이버 블로그 구조에 따라 본문을 긁어옴
    const content = await page.evaluate(() => {
      const postElement = document.querySelector('#viewTypeSelector') || document.querySelector('div.se-main-container');
      return postElement ? postElement.innerText : '본문을 찾을 수 없습니다';
    });

    return content;
  } catch (error) {
    console.error(`❌ 본문 추출 실패 (${url}):`, error.message);
    return '본문 추출 실패';
  } finally {
    await browser.close();
  }
}

module.exports = { extractBlogContent };
