import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const envPath = path.join(root, ".env");
const outDir = path.join(root, "public");
const outPath = path.join(outDir, "config.js");

const DEFAULTS = {
  SITE_NAME: "CTY TRANSPORTATION",
  SITE_TAGLINE: "Business-class NYC airport & luxury chauffeured service",
  SITE_DESCRIPTION:
    "CTY Transportation serves Mississauga and the greater NYC metro: business-class airport transfers, VVIP limos, black SUVs, hourly chauffeurs, family vans, and luxury vans for large groups.",
  OWNER_NAME: "Manvir Kaur",
  OWNER_EMAIL: "hello@example.com",
  CONTACT_FORM_ACTION: "https://formspree.io/f/REPLACE_ME",
  PRIMARY_PHONE: "(929) 390-5862",
  WHATSAPP_URL: "",
  META_KEYWORDS:
    "CTY Transportation, Mississauga limo, NYC airport car service, black SUV, luxury van, VVIP limo, hourly chauffeur",
  META_OG_IMAGE: "",
};

function parseEnv(text) {
  const env = {};
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    env[k] = v;
  }
  return env;
}

function buildConfig(env) {
  const g = (k) => env[k] ?? DEFAULTS[k] ?? "";
  return {
    siteName: g("SITE_NAME"),
    siteTagline: g("SITE_TAGLINE"),
    siteDescription: g("SITE_DESCRIPTION"),
    ownerName: g("OWNER_NAME"),
    ownerEmail: g("OWNER_EMAIL"),
    contactFormAction: g("CONTACT_FORM_ACTION"),
    primaryPhone: g("PRIMARY_PHONE"),
    whatsappUrl: g("WHATSAPP_URL"),
    metaKeywords: g("META_KEYWORDS"),
    metaOgImage: g("META_OG_IMAGE"),
  };
}

async function main() {
  await mkdir(outDir, { recursive: true });
  let env = {};
  try {
    const text = await readFile(envPath, "utf8");
    env = parseEnv(text);
  } catch {
    console.warn("No .env found; using defaults. Copy .env.example to .env.");
  }
  const cfg = buildConfig(env);
  const body = `window.__APP_CONFIG__ = ${JSON.stringify(cfg, null, 2)};\n`;
  await writeFile(outPath, body);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
