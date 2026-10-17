import fs from 'node:fs';
import path from 'node:path';

function toBase64(relPath: string, mime: string) {
  const fullPath = path.resolve(relPath);
  if (!fs.existsSync(fullPath)) return '';
  const buf = fs.readFileSync(fullPath);
  return `data:${mime};base64,${buf.toString('base64')}`;
}

const chosenIconBase64 = toBase64('assets/designs/masked_squircle.png', 'image/png');
const chosenSplashBase64 = toBase64('assets/designs/user_selected_splash.png', 'image/png');
const userUploadedBase64 = toBase64('assets/designs/user_selected_icon.png', 'image/png');

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>您选定的火箭 R 刃标 - 最终部署效果确认</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #080A0F;
      color: #E2E8F0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
      padding: 40px 20px 80px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .container { max-width: 1040px; width: 100%; }
    
    .header {
      text-align: center;
      margin-bottom: 40px;
    }
    h1 {
      font-size: 30px;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin-bottom: 12px;
      background: linear-gradient(135deg, #FFFFFF 0%, #94A3B8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .subtitle {
      color: #94A3B8;
      font-size: 15px;
      max-width: 680px;
      margin: 0 auto 16px;
      line-height: 1.6;
    }
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(206, 17, 65, 0.15);
      border: 1px solid rgba(206, 17, 65, 0.4);
      color: #FF4D6D;
      font-size: 13px;
      font-weight: 700;
      padding: 6px 14px;
      border-radius: 999px;
    }

    .section-title {
      font-size: 20px;
      font-weight: 700;
      color: #F8FAFC;
      margin: 36px 0 16px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .section-title::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 20px;
      background: #CE1141;
      border-radius: 2px;
    }

    .showcase-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 28px;
      margin-bottom: 36px;
    }
    @media (max-width: 768px) {
      .showcase-grid { grid-template-columns: 1fr; }
    }

    .card {
      background: #0F131D;
      border: 1px solid #1E293B;
      border-radius: 20px;
      padding: 24px;
      box-shadow: 0 20px 40px -15px rgba(0,0,0,0.8);
      display: flex;
      flex-direction: column;
    }
    .card h3 {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 6px;
      color: #FFF;
    }
    .card p.desc {
      font-size: 13px;
      color: #94A3B8;
      margin-bottom: 20px;
      line-height: 1.5;
    }

    .icon-preview-box {
      background: radial-gradient(circle at center, #1E2433 0%, #0D1017 100%);
      border: 1px solid #283347;
      border-radius: 16px;
      padding: 40px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 24px;
      flex: 1;
    }
    .app-icon-img {
      width: 140px;
      height: 140px;
      border-radius: 28px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08);
      transition: transform 0.2s ease;
    }
    .app-icon-img:hover {
      transform: scale(1.05);
    }
    .icon-sizes-row {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-top: 10px;
    }
    .mini-icon-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      color: #64748B;
    }
    .mini-icon-item img {
      border-radius: 22%;
      border: 1px solid rgba(255,255,255,0.1);
    }

    .phone-mockup-wrap {
      background: radial-gradient(circle at center, #1E2433 0%, #0D1017 100%);
      border: 1px solid #283347;
      border-radius: 16px;
      padding: 30px 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
    }
    .phone-frame {
      width: 240px;
      height: 480px;
      background: #000;
      border-radius: 40px;
      border: 5px solid #2A3245;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.1);
      overflow: hidden;
      position: relative;
    }
    .phone-notch {
      position: absolute;
      top: 8px;
      left: 50%;
      transform: translateX(-50%);
      width: 70px;
      height: 18px;
      background: #111;
      border-radius: 10px;
      z-index: 10;
    }
    .phone-screen {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .original-card {
      background: #0F131D;
      border: 1px solid #1E293B;
      border-radius: 20px;
      padding: 24px;
      margin-bottom: 30px;
      display: flex;
      align-items: center;
      gap: 24px;
    }
    .original-card img {
      width: 120px;
      height: auto;
      border-radius: 16px;
      border: 1px solid #334155;
    }

    .footer-actions {
      text-align: center;
      padding: 30px 20px;
      background: #0F131D;
      border: 1px solid #283347;
      border-radius: 16px;
      margin-top: 20px;
    }
    .footer-actions p {
      color: #CBD5E1;
      font-size: 15px;
      margin-bottom: 8px;
    }
    .confirm-tag {
      color: #10B981;
      font-weight: 700;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="status-badge">✦ 您上传指定的火箭「R」动能刃标</div>
      <h1 style="margin-top: 14px;">ClutchWire 终选方案：火箭穿透刃标「R」</h1>
      <p class="subtitle">
        休斯敦经典大白字「R」骨架，穿插烈焰火箭环流与推进尾翼。霸气刚劲、识别度拉满！
      </p>
    </div>

    <div class="original-card">
      <img src="${userUploadedBase64}" alt="您指定上传的图标" />
      <div>
        <h3 style="font-size: 16px; color: #FFF; margin-bottom: 6px;">您选择的原图确认</h3>
        <p style="color: #94A3B8; font-size: 13px; line-height: 1.6;">
          已根据您发来的这一款，完成了像素级无损提取，消除了多余的环境杂光，并精细渲染为标准的 512×512 视网膜应用图标与 1242×2688 全屏开屏启动页！
        </p>
      </div>
    </div>

    <div class="section-title">真机渲染效果确认</div>
    <div class="showcase-grid">
      <!-- 手机主图标预览 -->
      <div class="card">
        <h3>1. 移动端 App / PWA 主图标 (512×512)</h3>
        <p class="desc">多尺寸自适应，暗黑黑曜石底座，高对比度红白标识。</p>
        <div class="icon-preview-box">
          <img class="app-icon-img" src="${chosenIconBase64}" alt="应用图标" />
          <div class="icon-sizes-row">
            <div class="mini-icon-item">
              <img src="${chosenIconBase64}" width="54" height="54" alt="54px" />
              <span>手机桌面 (54px)</span>
            </div>
            <div class="mini-icon-item">
              <img src="${chosenIconBase64}" width="36" height="36" alt="36px" />
              <span>通知消息 (36px)</span>
            </div>
            <div class="mini-icon-item">
              <img src="${chosenIconBase64}" width="20" height="20" alt="20px" />
              <span>浏览器标签 (20px)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 手机全屏启动页预览 -->
      <div class="card">
        <h3>2. 手机全屏启动页 (1242×2688 Splash Screen)</h3>
        <p class="desc">打开 App 时的沉浸式全屏过渡，深色 OLED 纯黑与微光火箭红。</p>
        <div class="phone-mockup-wrap">
          <div class="phone-frame">
            <div class="phone-notch"></div>
            <img class="phone-screen" src="${chosenSplashBase64}" alt="启动页效果" />
          </div>
        </div>
      </div>
    </div>

    <div class="footer-actions">
      <p><strong>这就是您指定选择的那款图标！效果非常霸气且极具休斯敦火箭代表性！</strong></p>
      <p style="color: #94A3B8; font-size: 13px;">请看上面的实机效果，如果确定无误，我马上为您打包生成全套并直接部署到 VPS 线上！</p>
    </div>
  </div>
</body>
</html>
`;

fs.writeFileSync('preview-designs.html', html, 'utf-8');
console.log('Preview updated with user chosen icon!');
