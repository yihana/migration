// crawlBlogList_puppeteer.js
const puppeteer = require('puppeteer');
const fs = require('fs');
require('dotenv').config();

async function crawlBlogPosts(blogId) {
const browser = await puppeteer.launch({
headless: true,
args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const page = await browser.newPage();

// 네이버 로그인 쿠키 설정
await page.setCookie(
{
name: 'NID_AUT',
value: process.env.NID_AUT,
domain: '.naver.com',
path: '/',
httpOnly: true,
secure: true
},
{
name: 'NID_SES',
value: process.env.NID_SES,
domain: '.naver.com',
path: '/',
httpOnly: true,
secure: true
}
);

const targetUrl = `https://blog.naver.com/PostList.naver?blogId=${blogId}`;
console.log(`✅ 블로그 페이지로 이동 중: ${targetUrl}`);

try {
await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
console.log('✅ 페이지 로드 완료');

// 로그인 상태 확인
const bodyText = await page.evaluate(() => document.body.innerText);
if (bodyText.includes('로그인')) {
  console.log('⚠️ 로그인되지 않음. 로그인이 필요한 페이지입니다.');
  await browser.close();
  return [];
} else {
  console.log('✅ 로그인 상태 확인 완료');
}

console.log('⏳ 동적 로딩 대기 중...');
await page.waitForTimeout?.(3000); // 최신 puppeteer 버전은 optional chaining 필요

let links = [];

const hasIframe = await page.$('iframe#mainFrame');
if (hasIframe) {
  console.log('🔗 mainFrame iframe 감지됨. 내부 탐색 시작.');
  const frame = await (await page.$('iframe#mainFrame')).contentFrame();
  links = await frame.$$eval('a[href*="PostView.naver"]', anchors =>
    anchors.map(a => a.href)
  );
} else {
  console.log('❗ mainFrame이 존재하지 않습니다. 직접 HTML에서 링크를 탐색합니다.');
  links = await page.$$eval('a[href*="PostView.naver"]', anchors =>
    anchors.map(a => a.href)
  );
}

console.log(`✅ 수집한 링크 개수: ${links.length}`);
await browser.close();
return links;

} catch (error) {
console.error(`❗ 오류 발생: ${error.message}`);
await browser.close();
return [];
}
}

// 실행
(async () => {
const blogId = process.env.NAVER_BLOG_ID;
const postUrls = await crawlBlogPosts(blogId);
console.log(postUrls);
})();