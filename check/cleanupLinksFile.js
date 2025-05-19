// cleanupLinksFile.js

const fs = require('fs');

const readline = require('readline');

const filePath = 'mobile_links.txt';

// 1. 파일 존재 여부 확인

if (!fs.existsSync(filePath)) {

console.log('⚠️ mobile_links.txt 파일이 존재하지 않습니다.');

process.exit(0);

}

// 2. 파일 내용 미리 보여주기

const content = fs.readFileSync(filePath, 'utf8');

console.log('\n📄 [mobile_links.txt] 파일 내용 미리보기:\n');

console.log(content.substring(0, 1000)); // 너무 길면 앞 1000자만 표시

if (content.length > 1000) console.log('\n...이하 생략됨\n');

// 3. 수동 확인 → 삭제 여부 입력

const rl = readline.createInterface({

input: process.stdin,

output: process.stdout,

});

rl.question('❓ 파일을 삭제하시겠습니까? (y/N): ', (answer) => {

if (answer.toLowerCase() === 'y') {

try {

fs.unlinkSync(filePath);

console.log('✅ 파일이 성공적으로 삭제되었습니다.');

} catch (err) {

console.error('❌ 파일 삭제 중 오류 발생:', err.message);

}

} else {

console.log('ℹ️ 파일을 삭제하지 않았습니다.');

}

rl.close();

});