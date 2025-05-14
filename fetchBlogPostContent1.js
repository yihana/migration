const fs = require('fs');
const puppeteer = require('puppeteer');

async function fetchContent(url) {
const browser = await puppeteer.launch({
headless: true,
args: ['--no-sandbox', '--disable-setuid-sandbox']
});
const page = await browser.newPage();

try {
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

// 본문 추출 가능한 다양한 후보 셀렉터
const selectors = [
  'div.se-main-container',
  'div.post_ct', // 예전 블로그
  'div#postViewArea',
  'div.view',
  'div.post-view-content',
  'div.se_component_wrap'
];

let content = null;
for (const selector of selectors) {
  const exists = await page.$(selector);
  if (exists) {
    content = await page.$eval(selector, el => el.innerText.trim());
    break;
  }
}

if (!content) throw new Error('본문 요소를 찾을 수 없습니다.');

return content;

} catch (error) {
console.error(`❌ 오류 발생 [${url}]: ${error.message}`);
return null;
} finally {
await browser.close();
}
}

async function processAll() {
const urls = fs.readFileSync('mobile_links.txt', 'utf-8').split('\n').filter(Boolean);
const result = [];

for (let i = 0; i < urls.length; i++) {
const url = urls[i];
console.log(`🔍 (${i + 1}/${urls.length}) 처리 중: ${url}`);
const content = await fetchContent(url);
if (content) result.push({ url, content });
}

fs.writeFileSync('postContents.json', JSON.stringify(result, null, 2));
console.log(`✅ 총 ${result.length}개의 본문 수집 완료`);
}

processAll();