const axios = require('axios');
const cheerio = require('cheerio');

async function fetchAllBlogPostUrls(blogId) {
  const allUrls = [];
  let page = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    try {
      // 1. 블로그 메인 페이지 접속
      const mainPageUrl = `https://blog.naver.com/${blogId}`;
      const mainPageResponse = await axios.get(mainPageUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      });

      const $main = cheerio.load(mainPageResponse.data);

      const iframeSrc = $main('iframe#mainFrame').attr('src');
      console.log('🔍 iframeSrc:', iframeSrc);

      if (!iframeSrc) {
        console.error('❌ iframe을 찾을 수 없습니다.');
        break;
      }

      // 2. iframe 안 페이지 접속 (포스트 리스트)
      const iframeUrl = `https://blog.naver.com${iframeSrc}&currentPage=${page}`;
      const iframeResponse = await axios.get(iframeUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      });

      const $iframe = cheerio.load(iframeResponse.data);

      const postLinks = [];

      // 3. 포스트 링크 수집
      // $iframe('a[href*="/BlogPostView.naver"]').each((i, el) => {
      //   const href = $iframe(el).attr('href');
      //   if (href) {
      //     const absoluteUrl = 'https://blog.naver.com' + href;
      //     postLinks.push(absoluteUrl);
      //   }
      // });


      // ✅ 새로운 글 링크 (신버전)
      $iframe('a[href*="/BlogPostView.naver"]').each((i, el) => {
        const href = $iframe(el).attr('href');
        if (href) {
          const absoluteUrl = 'https://blog.naver.com' + href;
          postLinks.push(absoluteUrl);
        }
      });

      // ✅ 구버전 글 링크 (구버전)
      $iframe('a[href*="/PostView.naver"]').each((i, el) => {
        const href = $iframe(el).attr('href');
        if (href) {
          const absoluteUrl = 'https://blog.naver.com' + href;
          postLinks.push(absoluteUrl);
        }
      });

      // (구버전 대응) PostView.nhn 링크도 수집
      // $iframe('a[href*="/PostView.nhn"]').each((i, el) => {
      //   const href = $iframe(el).attr('href');
      //   if (href) {
      //     const absoluteUrl = 'https://blog.naver.com' + href;
      //     postLinks.push(absoluteUrl);
      //   }
      // });

      console.log(`✅ Page ${page} - ${postLinks.length}건 수집`);

      if (postLinks.length === 0) {
        hasNextPage = false;
      } else {
        allUrls.push(...postLinks);
        page++;
      }
    } catch (error) {
      console.error(`❌ 페이지 로딩 실패 (Page ${page}):`, error.message);
      break;
    }
  }

  console.log(`🎯 총 수집한 포스트 URL 수: ${allUrls.length}`);
  return allUrls;
}

// ✅ 반드시 추가 (migrate.js에서 쓰기 위해)
module.exports = { fetchAllBlogPostUrls };