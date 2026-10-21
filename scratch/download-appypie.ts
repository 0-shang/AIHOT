import fs from "node:fs";
import path from "node:path";

async function main() {
  const url = "https://apk-builder-kf4d.onrender.com/api/download/d40eaf72cf15_1792607223966";
  console.log("Downloading APK from AppyPie build server:", url);
  const res = await fetch(url);
  console.log("Status:", res.status, res.statusText);
  if (!res.ok) {
    const text = await res.text();
    console.error("Error:", text);
    return;
  }
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const outPath = path.resolve("scratch/appypie-clutchwire.apk");
  fs.writeFileSync(outPath, buffer);
  console.log(`Saved AppyPie APK to ${outPath} (${(buffer.length / 1024 / 1024).toFixed(2)} MB, ${buffer.length} bytes)`);
}

main().catch(console.error);
