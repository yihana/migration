const axios = require('axios');

const clientId = 'RdjY5XnbI3qmU5wdfZpC';
const clientSecret = '8XMl3VkAFb';
const code = 'XNb4A5mPivQ0t5q6BP';
const state = 'xyz123'; // 네가 인증할 때 보낸 state 값

async function getAccessToken() {
  try {
    const response = await axios.post('https://nid.naver.com/oauth2.0/token', null, {
      params: {
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        state: state
      }
    });

    console.log('✅ Access Token 발급 성공!');
    console.log(response.data);
  } catch (error) {
    console.error('❌ Access Token 발급 실패:', error.response.data);
  }
}

getAccessToken();
