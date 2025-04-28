const axios = require('axios');
require('dotenv').config();

const notionToken = process.env.NOTION_TOKEN;
const databaseId = process.env.NOTION_DATABASE_ID;

async function saveToNotion(title, content, url, publishDate, migrationDate) {
  try {
    const safeContent = (content && content.trim()) ? content.trim().slice(0, 2000) : "No content available.";
    const safeTitle = title || "Untitled";
    const safePublishDate = publishDate || new Date().toISOString().split('T')[0];
    const safeMigrationDate = migrationDate || new Date().toISOString().split('T')[0];
    const safeUrl = url || "https://example.com";  // ✅ 혹시 몰라 기본 URL 설정

    const response = await axios.post(
      'https://api.notion.com/v1/pages',
      {
        parent: { database_id: databaseId },
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: safeTitle
                }
              }
            ]
          },
          PublishDate: {
            date: {
              start: safePublishDate
            }
          },
          MigrationDate: {
            date: {
              start: safeMigrationDate
            }
          },
          URL: {
            url: safeUrl   // ✅ 정확히 'url' 타입에 safeUrl 대입
          }
        },
        children: [
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: safeContent
                  }
                }
              ]
            }
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${notionToken}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Notion 저장 성공:', title);
  } catch (error) {
    console.error('❌ Notion 저장 실패:', error.response?.data || error.message);
  }
}

module.exports = { saveToNotion };
