const fs = require('fs');
const puppeteer = require('puppeteer');

async function fetchBlogPostContents() {
const urls = fs.readFileSync('mobile_links2.txt', 'utf-8').split('\n').filter(Boolean);
const browser = await puppeteer.launch({
headless: true,
args: ['--no-sandbox', '--disable-setuid-sandbox']
});
const page = await browser.newPage();
const postList = [];

for (let i = 0; i < urls.length; i++) {
const url = urls[i];
console.log(`▶ (${i + 1}/${urls.length}) 처리 중: ${url}`);
try {
await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
await new Promise(r => setTimeout(r, 2000));

  const title = await page.$eval('h3.se_textarea', el => el.innerText).catch(() =>
    page.$eval('div#content-area span', el => el.innerText).catch(() => '')
  );
  const content = await page.$eval('div.se-main-container', el => el.innerText).catch(() =>
    page.$eval('div#postViewArea', el => el.innerText).catch(() => '')
  );
  const publishDate = await page.$eval('span.se_publishDate', el => el.innerText).catch(() =>
    page.$eval('span.date', el => el.innerText).catch(() => '')
  );
  const category = await page.$$eval('a[href*="CategoryList"]', links => {
    const catLink = links.find(link => link.innerText && link.innerText.trim().length > 0);
    return catLink ? catLink.innerText.trim() : '';
  }).catch(() => '');

  postList.push({ title, content, url, publishDate, category });
  fs.writeFileSync('postContents2.temp.json', JSON.stringify(postList, null, 2));
} catch (err) {
  console.error(`❌ 오류 발생 [${url}]:`, err.message);
}

}

fs.writeFileSync('postContents2.json', JSON.stringify(postList, null, 2));
await browser.close();
console.log('✅ 전체 크롤링 완료');
}

fetchBlogPostContents();