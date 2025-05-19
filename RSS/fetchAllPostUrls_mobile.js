const puppeteer = require('puppeteer');
require('dotenv').config();

async function fetchAllPostUrls(blogId) {
const browser = await puppeteer.launch({
headless: true,
args: ['--no-sandbox'],
executablePath: process.env.CHROME_PATH || undefined,
});

const page = await browser.newPage();

// 로그인 쿠키 설정 (비공개 글 접근용)
await page.setCookie(
{
name: 'NID_AUT',
value: process.env.NID_AUT,
domain: '.naver.com',
path: '/',
httpOnly: true,
secure: true,
},
{
name: 'NID_SES',
value: process.env.NID_SES,
domain: '.naver.com',
path: '/',
httpOnly: true,
secure: true,
}
);

const allUrls = [];
let pageNo = 1;

while (true) {
const url = `https://m.blog.naver.com/${blogId}?page=${pageNo}`;
console.log(`✅ Page ${pageNo} 이동 중: ${url}`);
await page.goto(url, { waitUntil: 'networkidle2' });

const links = await page.$$eval('a.link__Awlz5[href*="PostView.naver"]', anchors =>
  anchors.map(a => a.href)
);

if (links.length === 0) {
  console.log(`❗ Page ${pageNo}에 게시글 없음. 종료.`);
  break;
}

allUrls.push(...links);
pageNo++;
await page.waitForTimeout(1000);

}

await browser.close();
console.log(`🎯 총 수집한 포스트 URL 수: ${allUrls.length}`);
return allUrls;
}

module.exports = { fetchAllPostUrls };

// 테스트용 실행
if (require.main === module) {
fetchAllPostUrls(process.env.NAVER_BLOG_ID).then(urls => console.log(urls));
}