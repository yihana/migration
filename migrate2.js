// migrate2.js
const fs = require('fs');
const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

const posts = JSON.parse(fs.readFileSync('postContents2.json', 'utf-8'));

async function migrateToNotion() {
for (let i = 0; i < posts.length; i++) {
const post = posts[i];
try {
console.log(`▶ (${i + 1}/${posts.length}) 이관 중: ${post.title}`);
await notion.pages.create({
parent: { database_id: databaseId },
properties: {
제목: {
title: [{ text: { content: post.title } }]
},
URL: {
url: post.url
},
게시일: post.publishDate
? { date: { start: post.publishDate } }
: { date: null },
이관일: {
date: { start: post.migrationDate }
},
카테고리: {
rich_text: [{ text: { content: post.category || '없음' } }]
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
text: { content: post.content.slice(0, 2000) }
}
]
}
}
]
});
} catch (error) {
console.error(`❌ 실패 - ${post.title}:`, error.message);
}
}

console.log('✅ Notion 이관 완료');
}

migrateToNotion();