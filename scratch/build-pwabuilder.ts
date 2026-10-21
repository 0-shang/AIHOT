import fs from "node:fs";
import path from "node:path";

async function main() {
  const payload = {
    appVersion: "1.0.0.0",
    appVersionCode: 1,
    backgroundColor: "#0b0e14",
    display: "fullscreen",
    enableNotifications: false,
    enableSiteSettingsShortcut: true,
    fallbackType: "webview",
    features: {
      locationDelegation: { enabled: false },
      playBilling: { enabled: false }
    },
    host: "clutchwire.org",
    iconUrl: "https://clutchwire.org/icon.png",
    includeSourceCode: false,
    isChromeOSOnly: false,
    isMetaQuest: false,
    launcherName: "ClutchWire",
    maskableIconUrl: "https://clutchwire.org/icon.png",
    monochromeIconUrl: "https://clutchwire.org/icon.png",
    name: "ClutchWire",
    navigationColor: "#0b0e14",
    navigationColorDark: "#0b0e14",
    navigationDividerColor: "#0b0e14",
    navigationDividerColorDark: "#0b0e14",
    orientation: "default",
    packageId: "org.clutchwire.twa",
    pwaUrl: "https://clutchwire.org",
    shortcuts: [],
    signing: {
      file: null,
      alias: "clutchwire",
      fullName: "ClutchWire",
      organization: "ClutchWire",
      organizationalUnit: "App",
      countryCode: "US",
      keyPassword: "clutchwirepass",
      storePassword: "clutchwirepass"
    },
    signingMode: "new",
    splashScreenFadeOutDuration: 300,
    startUrl: "/",
    themeColor: "#ce1141",
    themeColorDark: "#ce1141",
    webManifestUrl: "https://clutchwire.org/manifest.webmanifest"
  };

  const serviceUrl = "https://pwabuilder-cloudapk.azurewebsites.net";
  console.log("1. Enqueueing package job to", serviceUrl);

  const enqueueRes = await fetch(`${serviceUrl}/enqueuePackageJob`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!enqueueRes.ok) {
    const text = await enqueueRes.text();
    throw new Error(`Failed to enqueue job: ${enqueueRes.status} ${enqueueRes.statusText}\n${text}`);
  }

  const receipt = await enqueueRes.json();
  console.log("Job receipt successfully received:", receipt);
  const { id, accessToken } = receipt;

  // Poll until complete
  console.log("2. Polling job status...");
  let completed = false;
  let attempts = 0;

  while (!completed && attempts < 90) {
    attempts++;
    await new Promise((r) => setTimeout(r, 4000));
    const statusRes = await fetch(`${serviceUrl}/getPackageJob?id=${encodeURIComponent(id)}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!statusRes.ok) {
      console.warn(`Status check attempt ${attempts}: ${statusRes.statusText}`);
      continue;
    }

    const job = await statusRes.json();
    console.log(`[Attempt ${attempts} / ~${attempts * 4}s] Status: ${job.status}`);

    if (job.status === "Completed") {
      completed = true;
      break;
    } else if (job.status === "Failed") {
      throw new Error(`Package job failed: ${JSON.stringify(job)}`);
    }
  }

  if (!completed) {
    throw new Error("Job timed out after polling");
  }

  console.log("3. Downloading package ZIP...");
  const dlRes = await fetch(`${serviceUrl}/downloadPackageZip?id=${encodeURIComponent(id)}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!dlRes.ok) {
    throw new Error(`Download failed: ${dlRes.status} ${dlRes.statusText}`);
  }

  const arrayBuffer = await dlRes.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const zipPath = path.resolve("scratch/clutchwire-package.zip");
  fs.writeFileSync(zipPath, buffer);
  console.log(`\nSUCCESS! Package ZIP saved to ${zipPath} (${(buffer.length / 1024 / 1024).toFixed(2)} MB)`);
}

main().catch(console.error);
