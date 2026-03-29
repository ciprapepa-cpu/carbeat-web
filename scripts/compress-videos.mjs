#!/usr/bin/env node

/**
 * compress-videos.mjs — Compress hero background videos with ffmpeg
 *
 * Usage:
 *   node scripts/compress-videos.mjs              # compress all videos
 *   node scripts/compress-videos.mjs --dry-run    # show sizes without compressing
 *
 * Requirements: ffmpeg must be installed (winget install ffmpeg)
 *
 * Settings: 720p, CRF 28, H.264 baseline, no audio.
 * These are background videos behind text overlay — high quality is not needed.
 * Originals are saved as .original.mp4 backup.
 */

import { readdir, stat, rename, unlink } from "node:fs/promises";
import { join, extname } from "node:path";
import { execSync } from "node:child_process";

const VIDEOS_DIR = join(import.meta.dirname, "..", "public", "videos");
const CRF = 28; // Higher = smaller file, lower quality (23 default, 28 is good for bg)
const MAX_HEIGHT = 720;

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");

  // Check ffmpeg
  try {
    execSync("ffmpeg -version", { stdio: "ignore" });
  } catch {
    console.error("❌ ffmpeg is not installed. Run: winget install ffmpeg");
    process.exit(1);
  }

  const entries = await readdir(VIDEOS_DIR);
  const videos = entries.filter(
    (f) => extname(f).toLowerCase() === ".mp4" && !f.includes(".original.")
  );

  if (videos.length === 0) {
    console.log("No videos found to compress.");
    return;
  }

  console.log(`🎬 ${dryRun ? "[DRY RUN] " : ""}Processing ${videos.length} video(s)\n`);
  let totalOriginal = 0;
  let totalNew = 0;

  for (const video of videos) {
    const inputPath = join(VIDEOS_DIR, video);
    const originalStat = await stat(inputPath);
    const originalSize = originalStat.size;
    totalOriginal += originalSize;

    if (dryRun) {
      console.log(`  📹 ${video} — ${formatSize(originalSize)}`);
      continue;
    }

    const backupPath = join(VIDEOS_DIR, video.replace(".mp4", ".original.mp4"));
    const tmpPath = join(VIDEOS_DIR, `_tmp_${video}`);

    console.log(`  📹 ${video} (${formatSize(originalSize)}) — compressing...`);

    try {
      // Compress: 720p, CRF 28, no audio, H.264 baseline for max compatibility
      execSync(
        `ffmpeg -i "${inputPath}" -vf "scale=-2:${MAX_HEIGHT}" -c:v libx264 -preset slow -crf ${CRF} -profile:v baseline -movflags +faststart -an -y "${tmpPath}"`,
        { stdio: "ignore" }
      );

      const newStat = await stat(tmpPath);
      const newSize = newStat.size;
      totalNew += newSize;

      const savedPct = ((1 - newSize / originalSize) * 100).toFixed(1);

      // Backup original, replace with compressed
      await rename(inputPath, backupPath);
      await rename(tmpPath, inputPath);

      console.log(
        `  ✅ ${formatSize(originalSize)} → ${formatSize(newSize)} (-${savedPct}%)`
      );
    } catch (err) {
      console.error(`  ❌ Failed: ${err.message}`);
      // Clean up temp file
      try { await unlink(tmpPath); } catch {}
    }
  }

  if (!dryRun && totalNew > 0) {
    const savedTotal = totalOriginal - totalNew;
    console.log(
      `\n💾 Total: ${formatSize(totalOriginal)} → ${formatSize(totalNew)} (saved ${formatSize(savedTotal)}, -${((1 - totalNew / totalOriginal) * 100).toFixed(0)}%)`
    );
    console.log(`\n🗑  To delete backups: rm public/videos/*.original.mp4`);
  } else if (dryRun) {
    console.log(`\n📊 Total: ${formatSize(totalOriginal)}`);
  }
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
