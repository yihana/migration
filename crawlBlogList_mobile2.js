// crawlBlogList_mobile2.js
const fs = require('fs');
const puppeteer = require('puppeteer');

async function fetchAllMobilePostUrls(blogId) {
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
const allUrls = new Set();
let pageNo = 1;

while (true) {
const targetUrl = `https://m.blog.naver.com/${blogId}?page=${pageNo}`;
console.log(`✅ Page ${pageNo} 이동 중: ${targetUrl}`);
await page.goto(targetUrl, { waitUntil: 'networkidle2' });

const postLinks = await page.$$eval('a.link__Awlz5', links => links.map(link => link.href));
if (postLinks.length === 0) {
  console.log(`❗ Page ${pageNo}에 게시글 없음. 종료.`);
  break;
}

postLinks.forEach(link => allUrls.add(link));
pageNo++;

}

const urls = [...allUrls];
fs.writeFileSync('mobile_links2.txt', urls.join('\n'));
console.log(`🎯 총 수집한 포스트 URL 수: ${urls.length}`);
await browser.close();
}

fetchAllMobilePostUrls('vali');