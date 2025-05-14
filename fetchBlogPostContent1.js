const fs = require('fs');
const axios = require('axios');
const { JSDOM } = require('jsdom');

async function extractPostContent(url) {
try {
const { data } = await axios.get(url, {
headers: {
'User-Agent': 'Mozilla/5.0',
},
});

const dom = new JSDOM(data);
const document = dom.window.document;

const title = document.querySelector('title')?.textContent.trim() || '제목 없음';
const paragraphs = Array.from(document.querySelectorAll('p')).map(p => p.textContent.trim());
const content = paragraphs.join('\\n').slice(0, 5000); // 글 길이 제한

return { url, title, content };

} catch (error) {
console.error(`❌ ${url} 처리 실패:`, error.message);
return null;
}
}

async function run() {
try {
const urls = fs.readFileSync('mobile_links.txt', 'utf-8').split('\n').filter(Boolean);
const results = [];

for (const url of urls) {
  const post = await extractPostContent(url);
  if (post) results.push(post);
}

fs.writeFileSync('postContents1.json', JSON.stringify(results, null, 2));
console.log(`✅ 총 ${results.length}건 저장 완료 (postContents1.json)`);

} catch (err) {
console.error('❌ 파일 처리 실패:', err.message);
}
}

run();