import fs from "node:fs";
import path from "node:path";

async function main() {
  const payload = {
    additionalTrustedOrigins: [],
    appVersion: "1.0.0",
    appVersionCode: 1,
    backgroundColor: "#0b0e14",
    themeColor: "#ce1141",
    display: "standalone",
    enableNotifications: false,
    enableSiteSettingsShortcut: true,
    fallbackType: "customtabs",
    features: {
      locationDelegation: { enabled: false },
      playBilling: { enabled: false }
    },
    host: "https://clutchwire.org",
    iconUrl: "https://clutchwire.org/icon.png",
    maskableIconUrl: "https://clutchwire.org/icon.png",
    includeSourceCode: false,
    isChromeOSOnly: false,
    launcherName: "ClutchWire",
    name: "ClutchWire",
    navigationColor: "#0b0e14",
    navigationColorDark: "#0b0e14",
    navigationDividerColor: "#0b0e14",
    navigationDividerColorDark: "#0b0e14",
    orientation: "default",
    packageId: "org.clutchwire.app"
  };

  console.log("Requesting APK from PWABuilder...");
  const res = await fetch("https://pwabuilder-google-play.azurewebsites.net/generateAppPackage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  console.log("Status:", res.status, res.statusText);
  if (!res.ok) {
    const text = await res.text();
    console.error("Error body:", text);
    return;
  }

  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  console.log("Received bytes:", buffer.length);

  const outZip = path.resolve("scratch/app-package.zip");
  fs.writeFileSync(outZip, buffer);
  console.log("Saved package to", outZip);
}

main().catch(console.error);
