import sharp from 'sharp';
import path from 'node:path';

const dir = 'c:/Users/96910/Documents/GitHub/AIHOT/promo-video/public/';

async function splitScreens() {
  // 1. feed:
  // 顶部 Header 包含: 网站Logo + 搜索 + (动态/热点/队记/专栏/流言 分类栏) -> y=0 到 210
  await sharp(path.join(dir, 'feed.png'))
    .extract({ left: 0, top: 0, width: 1000, height: 215 })
    .toFile(path.join(dir, 'feed_header.png'));

  // 中间 Content: 从分类栏下方 (y=215) 到 Tabbar 上方 (y=1390) -> 纯推文卡片流
  await sharp(path.join(dir, 'feed.png'))
    .extract({ left: 0, top: 215, width: 1000, height: 1175 })
    .toFile(path.join(dir, 'feed_content.png'));

  // 底部 Tabbar -> y=1390 到 1514
  await sharp(path.join(dir, 'feed.png'))
    .extract({ left: 0, top: 1390, width: 1000, height: 124 })
    .toFile(path.join(dir, 'feed_tabbar.png'));

  // 2. detail (专栏详情页):
  // 顶部 Header 包含: ←返回、书签、原文、分享 -> y=0 到 110
  await sharp(path.join(dir, 'detail.png'))
    .extract({ left: 0, top: 0, width: 1000, height: 110 })
    .toFile(path.join(dir, 'detail_header.png'));

  // 中间正文从 y=110 开始全部保留到 1514
  await sharp(path.join(dir, 'detail.png'))
    .extract({ left: 0, top: 110, width: 1000, height: 1404 })
    .toFile(path.join(dir, 'detail_content.png'));

  // 3. schedule (赛程战绩页):
  // 顶部 Header 包含: 标题 + 月份选择栏 -> y=0 到 350
  await sharp(path.join(dir, 'schedule.png'))
    .extract({ left: 0, top: 0, width: 1000, height: 350 })
    .toFile(path.join(dir, 'schedule_header.png'));

  // 中间 Content: 从月份下方 (y=350) 到 Tabbar 上方 (y=1390)
  await sharp(path.join(dir, 'schedule.png'))
    .extract({ left: 0, top: 350, width: 1000, height: 1040 })
    .toFile(path.join(dir, 'schedule_content.png'));

  // 底部 Tabbar
  await sharp(path.join(dir, 'schedule.png'))
    .extract({ left: 0, top: 1390, width: 1000, height: 124 })
    .toFile(path.join(dir, 'schedule_tabbar.png'));

  console.log('Flawless pixel-perfect layers extracted successfully!');
}

splitScreens().catch(console.error);
