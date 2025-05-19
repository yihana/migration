// migrate1_test.js (테스트용: 상위 10개만 처리)
const fs = require('fs');
const { Client } = require('@notionhq/client');
require('dotenv').config();
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;
async function migrate() {
try {
const rawData = fs.readFileSync('postContents.temp.json', 'utf-8');
const contents = JSON.parse(rawData).slice(0, 10); // 테스트용: 상위 10개만
console.log(`✅ 테스트용 마이그레이션 시작 (총 ${contents.length}개)`);

for (let i = 0; i < contents.length; i++) {
  const { title, content, url } = contents[i];
  console.log(`▶️ (${i + 1}) ${title} 등록 중...`);

  try {
    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Name: {
          title: [
            {
              text: { content: title || '(제목 없음)' },
            },
          ],
        },
        URL: {
          url: url || null,
        },
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
                  content: content?.slice(0, 1900) || '(내용 없음)',
                },
              },
            ],
          },
        },
      ],
    });
    console.log(`✅ (${i + 1}) 등록 완료`);
  } catch (e) {
    console.error(`❌ (${i + 1}) 등록 실패: ${e.message}`);
  }
}

console.log('🎉 테스트 마이그레이션 완료');

} catch (err) {
console.error('❌ 마이그레이션 실패:', err.message);
}
}
migrate();