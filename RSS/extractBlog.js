const axios = require('axios');
const cheerio = require('cheerio');

async function extractBlogContent(blogUrl) {
  try {
    const response = await axios.get(blogUrl);
    const $ = cheerio.load(response.data);

    const iframeSrc = $('#mainFrame').attr('src');
    if (iframeSrc) {
      const realUrl = `https://blog.naver.com${iframeSrc}`;
      const realResponse = await axios.get(realUrl);
      const $$ = cheerio.load(realResponse.data);

      const contentElement = $$('.se-main-container').html() || $$('.post-view').html();
      const title = $$('title').text().trim();

      const textContent = $$.text();

      return { title, content: textContent };
    } else {
      throw new Error('iframe을 찾을 수 없습니다.');
    }
  } catch (error) {
    console.error('블로그 추출 오류:', error.message);
    return null;
  }
}

module.exports = { extractBlogContent };
