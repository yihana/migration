// migrate.js (네이버와 노션 토큰 갱신을 분리하여 처리)
const { Client } = require('@notionhq/client');
const { refreshAccessToken } = require('./refreshAccessToken');
require('dotenv').config();

async function refreshNotionClient() {
require('dotenv').config(); // 최신 환경 변수 다시 로드
return new Client({ auth: process.env.NOTION_API_KEY });
}

async function refreshNaverTokenIfNeeded() {
if (!process.env.NAVER_ACCESS_TOKEN) {
console.log('⚠️ 네이버 Access Token 없음, 갱신 시도');
await refreshAccessToken();
require('dotenv').config();
}
}

async function checkNotionToken() {
if (!process.env.NOTION_API_KEY || process.env.NOTION_API_KEY === 'undefined') {
console.log('⚠️ Notion API Key 없음 또는 잘못됨');
return false;
}
return true;
}

async function migrate() {
// 1. NAVER 토큰 갱신 여부 확인
await refreshNaverTokenIfNeeded();

// 2. Notion 클라이언트 초기화
if (!await checkNotionToken()) {
    console.log('❌ Notion API Key 오류: .env 파일을 확인하세요.');
    return;
}
let notion = await refreshNotionClient();
const databaseId = process.env.NOTION_DATABASE_ID;

try {
    console.log('✅ Database 비우기 시작');
    await notion.databases.query({ database_id: databaseId });
    console.log('✅ Database 비우기 완료');
} catch (error) {
    if (error.code === 'unauthorized') {
        console.log('⚠️ Notion Access Token 만료 또는 잘못됨');
        console.log('🔄 .env 파일을 다시 확인하고, Notion API 키를 갱신하세요.');
        return;
    } else {
        console.error('❌ Database 비우기 오류: ', error.message);
    }
}


}

migrate();


// // migrate.js
// const { fetchAllBlogPostUrls } = require('./crawlBlogList_puppeteer');
// const { fetchBlogPostContent } = require('./fetchBlogPostContent');
// const { Client } = require('@notionhq/client');
// require('dotenv').config();

// const notion = new Client({ auth: process.env.NOTION_API_KEY });
// const databaseId = process.env.NOTION_DATABASE_ID;

// async function clearDatabase() {
//   const pages = await notion.databases.query({
//     database_id: databaseId,
//     page_size: 100,
//   });

//   for (const page of pages.results) {
//     await notion.pages.update({
//       page_id: page.id,
//       archived: true,
//     });
//     console.log(`🗑️ 페이지 삭제: ${page.id}`);
//   }
// }

// async function migrate() {
//   console.log('✅ Database 비우기 시작');
//   await clearDatabase();

//   console.log('✅ 블로그 글 목록 가져오기 시작');
//   const urls = await fetchAllBlogPostUrls(process.env.NAVER_BLOG_ID);

//   if (urls.length === 0) {
//     console.log('❗ 가져올 블로그 글이 없습니다.');
//     return;
//   }

//   for (const url of urls) {
//     const post = await fetchBlogPostContent(url);

//     if (!post) {
//       console.error('❌ 포스트 가져오기 실패:', url);
//       continue;
//     }

//     try {
//       await notion.pages.create({
//         parent: { database_id: databaseId },
//         properties: {
//           Name: {
//             title: [
//               {
//                 text: {
//                   content: post.title || 'Untitled',
//                 },
//               },
//             ],
//           },
//           URL: {
//             url: post.url,
//           },
//           PublishDate: {
//             date: {
//               start: post.pubDate,
//             },
//           },
//           MigrationDate: {
//             date: {
//               start: new Date().toISOString().split('T')[0],
//             },
//           },
//         },
//         children: [
//           {
//             object: 'block',
//             type: 'paragraph',
//             paragraph: {
//               rich_text: [
//                 {
//                   type: 'text',
//                   text: {
//                     content: post.content,
//                   },
//                 },
//               ],
//             },
//           },
//         ],
//       });
//       console.log(`✅ 이관 성공: ${post.title}`);
//     } catch (error) {
//       console.error('❌ Notion 저장 실패:', error.body || error.message);
//     }
//   }

//   console.log('🎉 이관 완료!');
// }

// migrate();
