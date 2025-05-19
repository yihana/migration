// fetchBlogPosts_api.js
const axios = require('axios');
require('dotenv').config();

async function fetchBlogPostsFromAPI(blogId) {
  const accessToken = process.env.NAVER_ACCESS_TOKEN;

  try {
    const response = await axios.get(`https://openapi.naver.com/blog/listCategory.json`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      params: {
        blogId: blogId,
        count: 100, // 한 번에 최대 100개 요청 가능
      }
    });

    if (response.data && response.data.message) {
      console.log('✅ 글 목록 가져오기 성공');
      console.log(response.data.message.result);
      return response.data.message.result;
    } else {
      console.error('❌ 예상한 데이터가 없습니다.', response.data);
      return [];
    }
  } catch (error) {
    console.error('❌ 글 목록 가져오기 실패:', error.response ? error.response.data : error.message);
    return [];
  }
}

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://example.com');
  console.log('✅ Example.com loaded successfully');
  await browser.close();
})();
