import { readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const photosRoot = path.join(__dirname, "..", "public", "photos");
const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"]);

async function main() {
  const manifest = {};
  let entries;
  try {
    entries = await readdir(photosRoot, { withFileTypes: true });
  } catch {
    await writeFile(
      path.join(photosRoot, "manifest.json"),
      JSON.stringify({}, null, 2) + "\n",
    );
    return;
  }

  for (const ent of entries) {
    if (!ent.isDirectory() || ent.name.startsWith(".")) continue;
    const dir = path.join(photosRoot, ent.name);
    const files = await readdir(dir);
    const sorted = files.sort();
    let picked = null;
    for (const f of sorted) {
      const ext = path.extname(f).toLowerCase();
      if (!IMAGE_EXT.has(ext)) continue;
      const fp = path.join(dir, f);
      try {
        const st = await stat(fp);
        if (st.isFile()) {
          picked = `${ent.name}/${f}`;
          break;
        }
      } catch {
        continue;
      }
    }
    manifest[ent.name] = picked;
  }

  await writeFile(
    path.join(photosRoot, "manifest.json"),
    JSON.stringify(manifest, null, 2) + "\n",
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
