async function main() {
  const r = await fetch("https://www.pwabuilder.com/code/app-report.api-DHu52P9U.js");
  const content = await r.text();
  const matches = content.match(/fallbackType[^,;{}]+/g);
  console.log("fallbackType matches:", matches);
  
  const idx = content.indexOf("fallbackType");
  console.log("around fallbackType:\n", content.substring(idx - 100, idx + 400));
}

main().catch(console.error);
