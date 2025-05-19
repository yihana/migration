const axios = require('axios');
const cheerio = require('cheerio');

async function fetchBlogPostContent(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const $ = cheerio.load(response.data);

    const title = $('meta[property="og:title"]').attr('content') || $('title').text() || "No title";
    const description = $('meta[property="og:description"]').attr('content') || "No content";
    const pubDate = new Date().toISOString().split('T')[0]; // 임시 게시 날짜

    return {
      title,
      description,
      pubDate
    };
  } catch (error) {
    console.error(`❌ 글 내용 가져오기 실패 (${url}):`, error.message);
    return null;
  }
}

module.exports = { fetchBlogPostContent };
