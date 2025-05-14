const { Client } = require('@notionhq/client');
const fs = require('fs');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

async function createPage(post) {
try {
await notion.pages.create({
parent: { database_id: databaseId },
properties: {
Name: {
title: [
{
text: {
content: post.title || '(제목 없음)',
},
},
],
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
content: post.content.slice(0, 2000), // Notion 블럭은 길이 제한 있음
},
},
],
},
},
],
});
console.log(`✅ 업로드 완료: ${post.title}`);
} catch (error) {
console.error(`❌ 업로드 실패: ${post.title}`, error.message);
}
}

async function uploadPosts() {
const filePath = './postContents.json';

if (!fs.existsSync(filePath)) {
console.error('❌ postContents.json 파일이 존재하지 않습니다.');
return;
}

const rawData = fs.readFileSync(filePath);
let posts;

try {
posts = JSON.parse(rawData);
} catch (err) {
console.error('❌ JSON 파싱 실패:', err);
return;
}

console.log(`📦 총 ${posts.length}개의 포스트를 Notion으로 업로드 시작`);
for (const post of posts) {
await createPage(post);
}
console.log('🏁 전체 업로드 완료');
}

uploadPosts();