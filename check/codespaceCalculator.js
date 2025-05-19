const readline = require('readline');

// 요금표 (2024년 기준 예시)
const rates = {
  "2core": 0.18, // 시간당 USD
  "4core": 0.36,
  "8core": 0.72
};

const storageRatePerGB = 0.07; // 1GB당 월 USD

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

(async () => {
  console.log("\n✨ Codespaces 예상 요금 계산기 ✨\n");

  const coreType = await ask("사용할 사양을 입력하세요 (2core, 4core, 8core): ");
  const hoursPerDay = await ask("하루 사용 예상 시간은 몇 시간인가요?: ");
  const daysPerMonth = await ask("한달에 몇 일 작업할 예정인가요?: ");
  const storageGB = await ask("Codespace 저장 예상 용량은 몇 GB인가요?: ");

  rl.close();

  // 요금 계산
  const hourlyRate = rates[coreType.trim()];
  const computeCost = hourlyRate * Number(hoursPerDay) * Number(daysPerMonth);
  const storageCost = storageRatePerGB * Number(storageGB);

  const totalCost = computeCost + storageCost;

  console.log("\n💻 예상 Compute 요금: $" + computeCost.toFixed(2) + " USD");
  console.log("🗄️ 예상 Storage 요금: $" + storageCost.toFixed(2) + " USD");
  console.log("📦 예상 총 요금: $" + totalCost.toFixed(2) + " USD\n");

  console.log("※ 무료 제공량(120 core hours, 15GB Storage)이 있다면 초과분만 과금됩니다.\n");
})();
