const fs = require('fs');
const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

async function readPostContents() {
try {
const data = fs.readFileSync('postContents1.json', 'utf-8');
return JSON.parse(data);
} catch (error) {
console.error('❌ postContents1.json 읽기 실패:', error.message);
return [];
}
}

async function saveToNotion(posts) {
for (const [index, post] of posts.entries()) {
try {
await notion.pages.create({
parent: { database_id: databaseId },
properties: {
Name: {
title: [
{
text: {
content: post.title || `포스트 ${index + 1}`,
},
},
],
},
URL: {
url: post.url,
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
content: post.content.slice(0, 2000), // 최대 2000자
},
},
],
},
},
],
});
console.log(`✅ 저장됨: ${post.title}`);
} catch (error) {
console.error(`❌ 저장 실패 (${post.title}):`, error.message);
}
}
}

(async () => {
const posts = await readPostContents();
if (posts.length === 0) {
console.log('❗ 저장할 데이터가 없습니다.');
return;
}
console.log(`🚀 ${posts.length}개의 포스트를 Notion에 저장합니다...`);
await saveToNotion(posts);
})();