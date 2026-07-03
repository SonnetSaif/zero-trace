const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const baseManifestPath = path.join(root, "manifest.base.json");
const outputManifestPath = path.join(root, "manifest.json");

const target = (process.argv[2] || "chromium").toLowerCase();

if (!fs.existsSync(baseManifestPath)) {
  console.error("manifest.base.json not found.");
  process.exit(1);
}

const base = JSON.parse(fs.readFileSync(baseManifestPath, "utf8"));

const manifest = { ...base };

if (target === "chromium") {
  manifest.background = {
    service_worker: "background.js"
  };
  delete manifest.browser_specific_settings;
} else if (target === "firefox") {
  manifest.background = {
    scripts: ["background.js"]
  };
  manifest.browser_specific_settings = {
    gecko: {
      id: "all-in-one-cleaner@local",
      strict_min_version: "121.0"
    }
  };
} else {
  console.error('Unknown target. Use "chromium" or "firefox".');
  process.exit(1);
}

fs.writeFileSync(outputManifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log(`Generated manifest.json for ${target}.`);
