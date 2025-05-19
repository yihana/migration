// refreshAccessToken.js
const axios = require('axios');
require('dotenv').config();
const fs = require('fs');

async function refreshAccessToken() {
    try {
        const response = await axios.post('https://nid.naver.com/oauth2.0/token', null, {
            params: {
                grant_type: 'refresh_token',
                client_id: process.env.NAVER_CLIENT_ID,
                client_secret: process.env.NAVER_CLIENT_SECRET,
                refresh_token: process.env.NAVER_REFRESH_TOKEN,
            }
        });

        if (response.data.access_token) {
            console.log('✅ Access Token 갱신 성공!');
            // .env 파일 갱신
            const newEnv = `NAVER_ACCESS_TOKEN=${response.data.access_token}\nNAVER_REFRESH_TOKEN=${response.data.refresh_token || process.env.NAVER_REFRESH_TOKEN}\n`;
            fs.writeFileSync('.env', newEnv, { flag: 'a' });
            console.log('✅ .env 파일 갱신 완료');
        } else {
            console.error('❌ Access Token 갱신 실패: ', response.data);
        }
    } catch (error) {
        console.error('❌ Access Token 갱신 실패: ', error.response ? error.response.data : error.message);
    }
}

module.exports = { refreshAccessToken };
