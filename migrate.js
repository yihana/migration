const { extractBlogContent } = require('./extractBlog');
const { saveToNotion } = require('./saveToNotion');

const blogUrls = [
  'https://blog.naver.com/블로그ID/포스트번호', // 여기에 블로그 URL을 추가해
];

(async () => {
  for (let url of blogUrls) {
    const blogData = await extractBlogContent(url);
    if (blogData) {
      await saveToNotion(blogData.title, blogData.content);
    }
  }
})();
