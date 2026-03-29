#!/usr/bin/env node

/**
 * optimize-images.mjs — Convert & optimize car photos to WebP
 *
 * Usage:
 *   node scripts/optimize-images.mjs              # all car folders
 *   node scripts/optimize-images.mjs seat-leon    # specific car (partial match)
 *   node scripts/optimize-images.mjs audi merc    # multiple (partial match)
 *
 * Settings: max 1920px width, WebP 92% quality.
 * Only overwrites if WebP result is smaller than original.
 * Original files are kept as .bak if converted.
 */

import { readdir, stat, rename } from "node:fs/promises";
import { join, extname, basename } from "node:path";
import sharp from "sharp";

const CARS_DIR = join(import.meta.dirname, "..", "public", "images", "cars");
const MAX_WIDTH = 1920;
const WEBP_QUALITY = 92;
const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png"]);

async function optimizeFile(filePath) {
  const ext = extname(filePath).toLowerCase();
  if (!IMAGE_EXTS.has(ext)) return null;

  const originalStat = await stat(filePath);
  const originalSize = originalStat.size;

  const image = sharp(filePath);
  const metadata = await image.metadata();

  let pipeline = image;
  if (metadata.width && metadata.width > MAX_WIDTH) {
    pipeline = pipeline.resize(MAX_WIDTH, null, { withoutEnlargement: true });
  }

  const webpBuffer = await pipeline
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();

  if (webpBuffer.length >= originalSize) {
    return { skipped: true, reason: "WebP not smaller", originalSize };
  }

  const webpPath = filePath.replace(/\.\w+$/, ".webp");
  const bakPath = filePath + ".bak";

  // Rename original to .bak, write WebP
  await rename(filePath, bakPath);
  await sharp(bakPath)
    .resize(MAX_WIDTH, null, { withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toFile(webpPath);

  return {
    skipped: false,
    originalSize,
    newSize: webpBuffer.length,
    saved: originalSize - webpBuffer.length,
    savedPct: ((1 - webpBuffer.length / originalSize) * 100).toFixed(1),
  };
}

async function processFolder(folderPath, folderName) {
  const entries = await readdir(folderPath);
  const imageFiles = entries.filter((f) => IMAGE_EXTS.has(extname(f).toLowerCase()));

  if (imageFiles.length === 0) return;

  console.log(`\n📁 ${folderName} (${imageFiles.length} images)`);
  let totalSaved = 0;

  for (const file of imageFiles) {
    const filePath = join(folderPath, file);
    const result = await optimizeFile(filePath);

    if (!result) continue;
    if (result.skipped) {
      console.log(`  ⏭  ${file} — skipped (${result.reason})`);
    } else {
      totalSaved += result.saved;
      console.log(
        `  ✅ ${file} → .webp  ${formatSize(result.originalSize)} → ${formatSize(result.newSize)} (-${result.savedPct}%)`
      );
    }
  }

  if (totalSaved > 0) {
    console.log(`  💾 Saved ${formatSize(totalSaved)} in ${folderName}`);
  }
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function main() {
  const filters = process.argv.slice(2);

  let folders;
  try {
    const entries = await readdir(CARS_DIR);
    folders = [];
    for (const entry of entries) {
      const entryPath = join(CARS_DIR, entry);
      const s = await stat(entryPath);
      if (s.isDirectory()) folders.push(entry);
    }
  } catch {
    console.error(`❌ Directory not found: ${CARS_DIR}`);
    process.exit(1);
  }

  if (filters.length > 0) {
    folders = folders.filter((f) =>
      filters.some((filter) => f.toLowerCase().includes(filter.toLowerCase()))
    );
    if (folders.length === 0) {
      console.log("No matching car folders found.");
      process.exit(0);
    }
  }

  console.log(`🔧 Optimizing ${folders.length} folder(s) in ${CARS_DIR}`);

  for (const folder of folders) {
    await processFolder(join(CARS_DIR, folder), folder);
  }

  console.log("\n✅ Done!");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
