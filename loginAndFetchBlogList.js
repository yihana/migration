// loginAndFetchBlogList.js
const puppeteer = require('puppeteer');
require('dotenv').config();

async function loginAndFetchBlogUrls(blogId) {
  const browser = await puppeteer.launch({
    headless: false, // 눈으로 로그인 과정을 보고 싶으면 false
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('https://nid.naver.com/nidlogin.login', { waitUntil: 'networkidle2' });

  // ✅ 네이버 로그인 입력
  await page.type('#id', process.env.NAVER_ID);
  await page.type('#pw', process.env.NAVER_PW);
  await page.click('.btn_login');

  await page.waitForNavigation({ waitUntil: 'networkidle2' });

  console.log('✅ 로그인 성공');

  // ✅ 블로그 글 목록으로 이동
  let pageNo = 1;
  const allUrls = [];
  let hasNextPage = true;

  while (hasNextPage) {
    const listUrl = `https://blog.naver.com/PostList.naver?blogId=${blogId}&currentPage=${pageNo}`;
    await page.goto(listUrl, { waitUntil: 'networkidle2' });
    console.log(`✅ Page ${pageNo} 이동 중...`);

    const postLinks = await page.$$eval('a[href*="PostView.naver"]', links =>
      links.map(link => link.href)
    );

    console.log(`✅ Page ${pageNo} - ${postLinks.length}건 수집`);

    if (postLinks.length === 0) {
      hasNextPage = false;
    } else {
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
  const urls = await loginAndFetchBlogUrls('vali');
  console.log(urls);
})();
