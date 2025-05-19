const readline = require('readline');

// 설정값
const FREE_CORE_HOURS = 120; // 네 무료 제공량: 120 core hour

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 질문을 받아주는 함수
function ask(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

(async () => {
  console.log("\n✨ Codespaces 무료 제공량 남은 사용량 계산기 ✨\n");

  const cores = await ask("현재 사용한 사양은 몇 core인가요? (예: 2): ");
  const hours = await ask("현재 몇 시간 사용했나요? (예: 1.45): ");

  rl.close();

  // 사용량 계산
  const usedCoreHours = Number(cores) * Number(hours);
  const remainingCoreHours = FREE_CORE_HOURS - usedCoreHours;

  console.log(`\n🧮 현재 사용한 core-hour: ${usedCoreHours.toFixed(2)} core hours`);
  
  if (remainingCoreHours >= 0) {
    console.log(`✅ 아직 ${remainingCoreHours.toFixed(2)} core hours 남았습니다!`);
  } else {
    console.log(`⚠️ 무료 제공량을 초과했습니다! 초과 사용량: ${Math.abs(remainingCoreHours).toFixed(2)} core hours`);
  }

  console.log("\n(※ 매월 무료 제공량은 리셋됩니다.)\n");
})();
