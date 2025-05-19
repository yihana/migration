const axios = require('axios');
require('dotenv').config();

const notionToken = process.env.NOTION_TOKEN;
const databaseId = process.env.NOTION_DATABASE_ID;

// Database 안에 있는 모든 페이지를 가져와서 삭제
async function cleanDatabase() {
  try {
    // 모든 페이지 가져오기
    const queryResponse = await axios.post(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${notionToken}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json'
        }
      }
    );

    const pages = queryResponse.data.results;

    if (!pages.length) {
      console.log("✅ Database는 이미 비어 있습니다.");
      return;
    }

    console.log(`🧹 ${pages.length}개의 페이지 삭제 시작.`);

    for (const page of pages) {
      const pageId = page.id;
      await axios.patch(
        `https://api.notion.com/v1/pages/${pageId}`,
        { archived: true },
        {
          headers: {
            'Authorization': `Bearer ${notionToken}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json'
          }
        }
      );
    }

    console.log("✅ 모든 페이지 삭제 완료!");
  } catch (error) {
    console.error('❌ Database 비우기 실패:', error.response?.data || error.message);
  }
}

module.exports = { cleanDatabase };
