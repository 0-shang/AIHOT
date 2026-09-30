import assert from "node:assert/strict";
import { test } from "node:test";
import { isSubstantiveBody } from "@aihot/backend/content/sanitize";

test("rejects sidebar trending recommendation lists (e.g. Yahoo Sports TRENDING)", () => {
  const html = `
    <p>TRENDING</p>
    <ul>
      <li><a href="https://sports.yahoo.com/wild-card">Wild-card series updates</a></li>
      <li><a href="https://sports.yahoo.com/clark">Caitlin Clark's historic performance</a></li>
      <li><a href="https://sports.yahoo.com/obj">Giants release OBJ</a></li>
      <li><a href="https://sports.yahoo.com/nfl">NFL Power Rankings</a></li>
      <li><a href="https://sports.yahoo.com/lynx">Liberty sweep top-seeded Lynx</a></li>
    </ul>
    <p>Story by</p>
    <ul>
      <li>Story by</li>
    </ul>
  `;
  const text = "TRENDING Wild-card series updates Caitlin Clark's historic performance Giants release OBJ NFL Power Rankings Liberty sweep top-seeded Lynx Story by Story by";
  assert.equal(isSubstantiveBody(html, text), false, "should reject trending sidebar recommendation links");
});

test("rejects link-heavy navigation and recommendation dumps", () => {
  const links = Array.from({ length: 8 }, (_, i) => `<li><a href="/post/${i}">Top headline number ${i} about sports and entertainment</a></li>`).join("");
  const html = `<h2>Popular Stories</h2><ul>${links}</ul>`;
  const text = "Popular Stories " + Array.from({ length: 8 }, (_, i) => `Top headline number ${i} about sports and entertainment`).join(" ");
  assert.equal(isSubstantiveBody(html, text), false, "should reject high link density collections");
});

test("rejects short fragments without substantive narrative paragraphs", () => {
  const html = `
    <p>Breaking News</p>
    <p>Follow our channel for updates.</p>
    <p>Read next below.</p>
  `;
  const text = "Breaking News Follow our channel for updates. Read next below.";
  assert.equal(isSubstantiveBody(html, text), false, "should reject short fragments without long sentences");
});

test("accepts genuine sports and news articles with proper paragraphs", () => {
  const html = `
    <p>休斯敦火箭队主教练伊梅·乌度卡在今日球队备战训练结束后，正式向随队记者确认了新赛季常规赛的首发五人阵容名单。</p>
    <p>在休赛期重磅加盟的凯文·杜兰特将与狄龙·布鲁克斯共同搭档锋线，阿尔佩伦·申京稳坐五号位中锋核心位置。而在后卫线上，由于范弗里特在训练营前遭遇伤病，阿门·汤普森与杰伦·格林将联袂出任先发后场组合。</p>
    <p>乌度卡在接受采访时特别强调：“这套阵容拥有极高水准的防守弹性和推快反击速度，全队在新赛季的目标是保持高强度对抗并冲击更高排名。”</p>
  `;
  const text = "休斯敦火箭队主教练伊梅·乌度卡在今日球队备战训练结束后，正式向随队记者确认了新赛季常规赛的首发五人阵容名单。在休赛期重磅加盟的凯文·杜兰特将与狄龙·布鲁克斯共同搭档锋线，阿尔佩伦·申京稳坐五号位中锋核心位置。而在后卫线上，由于范弗里特在训练营前遭遇伤病，阿门·汤普森与杰伦·格林将联袂出任先发后场组合。乌度卡在接受采访时特别强调：“这套阵容拥有极高水准的防守弹性和推快反击速度，全队在新赛季的目标是保持高强度对抗并冲击更高排名。”";
  assert.equal(isSubstantiveBody(html, text), true, "should accept genuine article with substantial paragraphs");
});

test("accepts genuine articles containing occasional inline reference links", () => {
  const html = `
    <p>Houston Rockets head coach Ime Udoka addressed the media following Wednesday's practice session to clarify the team's planned opening-night rotation.</p>
    <p>With veteran guard Fred VanVleet sidelined due to injury, Udoka noted that Amen Thompson is slated to join Jalen Green in the primary backcourt pairing, according to <a href="https://example.com/report">local beat reporters</a>.</p>
    <p>Meanwhile, newly acquired forward Kevin Durant will start alongside Dillon Brooks and Turkish center Alperen Sengun, giving Houston one of the most versatile frontline lineups in the Western Conference this upcoming season.</p>
  `;
  const text = "Houston Rockets head coach Ime Udoka addressed the media following Wednesday's practice session to clarify the team's planned opening-night rotation. With veteran guard Fred VanVleet sidelined due to injury, Udoka noted that Amen Thompson is slated to join Jalen Green in the primary backcourt pairing, according to local beat reporters. Meanwhile, newly acquired forward Kevin Durant will start alongside Dillon Brooks and Turkish center Alperen Sengun, giving Houston one of the most versatile frontline lineups in the Western Conference this upcoming season.";
  assert.equal(isSubstantiveBody(html, text), true, "should accept real news article with a few inline links");
});
