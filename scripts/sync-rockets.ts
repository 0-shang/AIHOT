import { rocketsPipeline } from "../packages/backend/src/nba/pipeline.ts";

async function main() {
  console.log("🏀 开始执行休斯敦火箭数据管道同步...");
  const t0 = Date.now();
  const res = await rocketsPipeline.sync();
  const dur = Date.now() - t0;
  console.log(`✅ 同步完成！更新/校验赛程数: ${res.gamesUpdated} 场，耗时: ${dur}ms`);

  const schedule = await rocketsPipeline.getSchedule();
  console.log(`📅 当前全季已收录赛程: ${schedule.length} 场`);

  const players = await rocketsPipeline.getPlayers();
  console.log(`⭐ 当前已录入全队球员: ${players.length} 人`);
}

main().catch((err) => {
  console.error("❌ 同步出现异常:", err);
  process.exit(1);
});
