// fetchMobilePostList.js
const puppeteer = require('puppeteer');
require('dotenv').config();

const blogId = process.env.NAVER_BLOG_ID;

async function fetchAllMobilePostLinks(blogId) {
const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
const allUrls = [];

let pageNo = 1;
while (true) {
const url = `https://m.blog.naver.com/${blogId}?page=${pageNo}`;
console.log(`✅ Page ${pageNo} 이동 중: ${url}`);
await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

const postLinks = await page.$$eval('a.link__Awlz5[href*="PostView.naver"]', links =>
  links.map(link => link.href)
);

if (postLinks.length === 0) {
  console.log(`❗ Page ${pageNo}에 게시글 없음. 종료.`);
  break;
}

allUrls.push(...postLinks);
pageNo++;

}

await browser.close();
console.log(`🎯 총 수집한 포스트 URL 수: ${allUrls.length}`);
return allUrls;
}

// 실행
fetchAllMobilePostLinks(blogId).then(urls => {
console.log(urls);
});