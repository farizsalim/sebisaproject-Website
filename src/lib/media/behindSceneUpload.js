import { mkdir, mkdtemp, readFile, rmdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import os from "node:os";
import { Readable } from "node:stream";
import { spawn } from "node:child_process";
import multer from "multer";
import sharp from "sharp";
import { storageDirectory, storageUrl } from "@/lib/media/storage";

const maxUploadBytes = 200 * 1024 * 1024;
const behindScenesStorageDirectory = storageDirectory("behind-scenes");
const ffmpegPath = path.join(
  process.cwd(),
  "node_modules",
  "ffmpeg-static",
  process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg",
);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxUploadBytes },
  fileFilter: (_request, file, callback) => {
    callback(null, file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/"));
  },
});

export async function parseBehindSceneUpload(request) {
  const body = Buffer.from(await request.arrayBuffer());
  const nodeRequest = Readable.from(body);
  nodeRequest.headers = Object.fromEntries(request.headers.entries());
  nodeRequest.method = request.method;
  nodeRequest.httpVersion = "1.1";

  return new Promise((resolve, reject) => {
    upload.single("media")(nodeRequest, {}, (error) => {
      if (error) reject(error);
      else resolve(nodeRequest.file);
    });
  });
}

export async function saveBehindScene(file) {
  if (!file?.buffer) throw new Error("Media wajib diunggah");
  if (!file.mimetype.startsWith("image/") && !file.mimetype.startsWith("video/")) {
    throw new Error("Media harus berupa gambar atau video");
  }

  await mkdir(behindScenesStorageDirectory, { recursive: true });
  const isImage = file.mimetype.startsWith("image/");
  const filename = `${randomUUID()}.${isImage ? "webp" : "mp4"}`;
  const output = isImage
    ? await sharp(file.buffer).rotate().resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true }).webp({ quality: 82, effort: 4 }).toBuffer()
    : await compressVideo(file.buffer);

  await writeFile(path.join(behindScenesStorageDirectory, filename), output);
  return { filePath: storageUrl("behind-scenes", filename), fileSize: output.length, mimeType: isImage ? "image/webp" : "video/mp4" };
}

function compressVideo(inputBuffer) {
  return (async () => {
    const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), "sebisa-video-"));
    const inputPath = path.join(temporaryDirectory, "input");
    const outputPath = path.join(temporaryDirectory, "output.mp4");
    await writeFile(inputPath, inputBuffer);

    try {
      await new Promise((resolve, reject) => {
        const process = spawn(ffmpegPath, [
          "-hide_banner", "-loglevel", "error", "-i", inputPath,
          "-vf", "scale=w=1920:h=1080:force_original_aspect_ratio=decrease",
          "-c:v", "libx264", "-preset", "fast", "-crf", "28",
          "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart",
          "-y", outputPath,
        ]);
        const errors = [];
        process.stderr.on("data", (chunk) => errors.push(chunk));
        process.on("error", reject);
        process.on("close", (code) => {
          if (code === 0) resolve();
          else reject(new Error(`Video tidak dapat dikompres: ${Buffer.concat(errors).toString().trim()}`));
        });
      });

      return await readFile(outputPath);
    } finally {
      await unlink(inputPath).catch(() => {});
      await unlink(outputPath).catch(() => {});
      await rmdir(temporaryDirectory).catch(() => {});
    }
  })();
}

export async function removeBehindScene(filePath) {
  if (!filePath?.startsWith("/api/media/behind-scenes/")) return;
  await unlink(path.join(behindScenesStorageDirectory, path.basename(filePath))).catch(() => {});
}
