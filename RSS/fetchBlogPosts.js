const axios = require('axios');

const accessToken = 'AAAANAY8yzkhPAYDlxyWyI2UW8rYDSM2yqOIWxzLNYuI9L9m8Ktd5qLYZkKUk8InAPRQo4VIX5cwJ85sn8USy4N4NFc';

async function fetchBlogPosts(blogId, pageNo = 1, pageSize = 100) {
  try {
    const response = await axios.get('https://openapi.naver.com/v1/blog/listCategoryPost.json', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      params: {
        blogId: blogId,
        categoryNo: 0, // 전체 카테고리
        pageNo: pageNo,
        pageSize: pageSize
      }
    });

    console.log('✅ 글 목록 가져오기 성공!');
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error('❌ 글 목록 가져오기 실패:', error.response.data);
  }
}

// 사용 예시
fetchBlogPosts('vali');
