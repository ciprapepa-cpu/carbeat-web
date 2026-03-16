#!/usr/bin/env node

/**
 * Optimize car photos for web.
 *
 * Usage:
 *   node scripts/optimize-images.mjs                    # all cars
 *   node scripts/optimize-images.mjs seat-leon          # specific car
 *   node scripts/optimize-images.mjs mercedes-c43 audi  # multiple
 *
 * Resizes to max 1920px width, converts to JPG at 92% quality.
 * Originals are overwritten — run once per new batch of photos.
 */

import { readdir, stat, writeFile, rename, unlink } from "node:fs/promises";
import { join, extname } from "node:path";
import sharp from "sharp";

const CARS_DIR = join(import.meta.dirname, "..", "public", "images", "cars");
const MAX_WIDTH = 1920;
const QUALITY = 92;

async function optimizeFolder(folderPath, folderName) {
  const files = await readdir(folderPath);
  const images = files.filter((f) =>
    [".jpg", ".jpeg", ".png"].includes(extname(f).toLowerCase())
  );

  if (images.length === 0) {
    console.log(`  ${folderName}: no images found`);
    return;
  }

  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of images) {
    const filePath = join(folderPath, file);
    const before = (await stat(filePath)).size;
    totalBefore += before;

    const tmpPath = filePath + ".tmp";
    const info = await sharp(filePath)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toFile(tmpPath);

    const after = (await stat(tmpPath)).size;
    totalAfter += after;

    // Only overwrite if actually smaller
    if (after < before) {
      await unlink(filePath);
      await rename(tmpPath, filePath);
    } else {
      totalAfter = totalAfter - after + before;
      await unlink(tmpPath);
    }
  }

  const saved = totalBefore - totalAfter;
  const pct = ((saved / totalBefore) * 100).toFixed(1);
  console.log(
    `  ${folderName}: ${images.length} images, ${fmt(totalBefore)} → ${fmt(totalAfter)} (saved ${fmt(saved)}, ${pct}%)`
  );
}

function fmt(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function main() {
  const args = process.argv.slice(2);
  const allFolders = await readdir(CARS_DIR);
  const carFolders = allFolders.filter(async (f) => {
    const s = await stat(join(CARS_DIR, f));
    return s.isDirectory();
  });

  // Filter to requested folders, or all
  const dirs = [];
  for (const f of allFolders) {
    const s = await stat(join(CARS_DIR, f));
    if (!s.isDirectory()) continue;
    if (args.length === 0 || args.some((a) => f.includes(a))) {
      dirs.push(f);
    }
  }

  if (dirs.length === 0) {
    console.log("No matching car folders found.");
    process.exit(1);
  }

  console.log(`Optimizing ${dirs.length} folder(s)...\n`);

  for (const dir of dirs) {
    await optimizeFolder(join(CARS_DIR, dir), dir);
  }

  console.log("\nDone!");
}

main().catch(console.error);
