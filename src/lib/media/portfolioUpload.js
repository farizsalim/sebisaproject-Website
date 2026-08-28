import { mkdir, mkdtemp, readFile, rmdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import os from "node:os";
import { spawn } from "node:child_process";
import sharp from "sharp";
import { storageDirectory, storageUrl } from "@/lib/media/storage";

const maxUploadBytes = 200 * 1024 * 1024;
const portfolioStorageDirectory = storageDirectory("portfolio");
const ffmpegPath = path.join(process.cwd(), "node_modules", "ffmpeg-static", process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg");

export async function savePortfolioMedia(file) {
  if (!file || typeof file.arrayBuffer !== "function") throw new Error("Media portfolio wajib diunggah");
  if (file.size > maxUploadBytes) throw new Error("Ukuran media maksimal 200 MB");
  if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) throw new Error("Media harus berupa gambar atau video");

  const inputBuffer = Buffer.from(await file.arrayBuffer());
  const isImage = file.type.startsWith("image/");
  const filename = `${randomUUID()}.${isImage ? "webp" : "mp4"}`;
  const output = isImage
    ? await sharp(inputBuffer).rotate().resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true }).webp({ quality: 82, effort: 4 }).toBuffer()
    : await compressVideo(inputBuffer);

  await mkdir(portfolioStorageDirectory, { recursive: true });
  await writeFile(path.join(portfolioStorageDirectory, filename), output);
  return { filePath: storageUrl("portfolio", filename), fileSize: output.length, mimeType: isImage ? "image/webp" : "video/mp4", originalName: file.name || "" };
}

async function compressVideo(inputBuffer) {
  const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), "sebisa-portfolio-video-"));
  const inputPath = path.join(temporaryDirectory, "input");
  const outputPath = path.join(temporaryDirectory, "output.mp4");
  await writeFile(inputPath, inputBuffer);

  try {
    await new Promise((resolve, reject) => {
      const process = spawn(ffmpegPath, ["-hide_banner", "-loglevel", "error", "-i", inputPath, "-vf", "scale=w=1920:h=1080:force_original_aspect_ratio=decrease", "-c:v", "libx264", "-preset", "fast", "-crf", "28", "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", "-y", outputPath]);
      const errors = [];
      process.stderr.on("data", (chunk) => errors.push(chunk));
      process.on("error", reject);
      process.on("close", (code) => code === 0 ? resolve() : reject(new Error(`Video tidak dapat dikompres: ${Buffer.concat(errors).toString().trim()}`)));
    });
    return await readFile(outputPath);
  } finally {
    await unlink(inputPath).catch(() => {});
    await unlink(outputPath).catch(() => {});
    await rmdir(temporaryDirectory).catch(() => {});
  }
}

export async function removePortfolioMedia(filePath) {
  if (!filePath?.startsWith("/api/media/portfolio/")) return;
  await unlink(path.join(portfolioStorageDirectory, path.basename(filePath))).catch(() => {});
}