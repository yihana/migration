const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');

const rssUrl = 'https://rss.blog.naver.com/vali.xml';

function parsePubDate(rfcDateString) {
  if (!rfcDateString) {
    return new Date().toISOString().split('T')[0];
  }
  const date = new Date(rfcDateString);
  if (isNaN(date)) {
    return new Date().toISOString().split('T')[0];
  }
  return date.toISOString().split('T')[0];
}

async function fetchBlogDataFromRSS() {
  try {
    const response = await axios.get(rssUrl);

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      cdataPropName: "cdata",    // ✅ CDATA만 따로 추출
      alwaysCreateTextNode: false // ✅ #text는 무시
    });

    const jsonObj = parser.parse(response.data);

    const items = jsonObj.rss.channel.item;

    if (!items || items.length === 0) {
      console.log("✅ RSS에서 포스트를 찾지 못했어요.");
      return [];
    }

    const posts = items.map(item => {
      const link = (item.link && item.link.cdata) || item.link || "";

      if (typeof link !== 'string' || !link.startsWith('http')) {
        return null;
      }

      return {
        title: (item.title && item.title.cdata) || item.title || "Untitled",
        link: link.trim(),
        description: (item.description && item.description.cdata) || item.description || "No content available.",
        pubDate: parsePubDate(item.pubDate)
      };
    }).filter(post => post !== null);

    return posts;

  } catch (error) {
    console.error("❌ RSS 가져오기 실패:", error.message);
    return [];
  }
}

module.exports = { fetchBlogDataFromRSS };
