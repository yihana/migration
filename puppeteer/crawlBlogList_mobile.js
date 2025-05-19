const puppeteer = require('puppeteer');

async function fetchAllMobilePostUrls(blogId) {
const browser = await puppeteer.launch({
headless: true,
args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();
const allUrls = [];
let pageNo = 1;
let hasNextPage = true;

while (hasNextPage) {
const targetUrl = `https://m.blog.naver.com/${blogId}?page=${pageNo}`;
console.log(`✅ Page ${pageNo} 이동 중: ${targetUrl}`);

await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 60000 });

// 페이지 내 게시물 링크 추출
const postLinks = await page.$$eval('a.link__Awlz5', links =>
  links.map(link => link.href)
);

if (postLinks.length === 0) {
  console.log(`❗ Page ${pageNo}에 게시글 없음. 종료.`);
  hasNextPage = false;
} else {
  console.log(`✅ 수집한 게시글 수 (${pageNo}): ${postLinks.length}`);
  allUrls.push(...postLinks);
  pageNo++;
}

}

await browser.close();
console.log(`🎯 총 수집한 포스트 URL 수: ${allUrls.length}`);
return allUrls;
}

// 실행
(async () => {
const urls = await fetchAllMobilePostUrls('vali');
console.log(urls);
})();