const axios = require('axios');
const { notionToken, databaseId } = require('./config');

async function saveToNotion(title, content) {
  try {
    const response = await axios.post(
      'https://api.notion.com/v1/pages',
      {
        parent: { database_id: databaseId },
        properties: {
          Name: {
            title: [{ text: { content: title } }]
          }
        },
        children: [
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              text: [{ type: 'text', text: { content: content } }]
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
    console.error('❌ Notion 저장 실패:', error.response.data);
  }
}

module.exports = { saveToNotion };
