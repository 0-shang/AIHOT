async function main() {
  const r = await fetch("https://www.pwabuilder.com/code/app-report.api-DHu52P9U.js");
  const content = await r.text();
  const idx = content.indexOf("signingMode");
  console.log("around signingMode:\n", content.substring(idx - 100, idx + 600));
}

main().catch(console.error);
