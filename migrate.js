const { extractBlogContent } = require('./extractBlog');
const { saveToNotion } = require('./saveToNotion');
const { fetchBlogDataFromRSS } = require('./rssReader');
const { cleanDatabase } = require('./cleanDatabase');

(async () => {
  await cleanDatabase(); // 먼저 Database 전체 삭제

  const posts = await fetchBlogDataFromRSS();

  if (posts.length === 0) {
    console.log("❗ 가져올 블로그 글이 없습니다.");
    return;
  }

  for (const post of posts) {
    const blogData = await extractBlogContent(post.link);
    if (blogData) {
      await saveToNotion(
        blogData.title, 
        post.description,   // ✅ description을 본문으로 저장
        post.link,           // ✅ 링크를 URL로 저장
        post.pubDate, // 블로그 게시날짜
        new Date().toISOString().split('T')[0] // 실행 날짜
      );
    }
  }
})();
