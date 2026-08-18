import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import sharp from "sharp";

const maxUploadBytes = 5 * 1024 * 1024;
const storageDirectory = path.join(process.cwd(), "public", "storage", "mitra");

export async function saveClientLogo(file) {
  if (!file || typeof file.arrayBuffer !== "function") {
    throw new Error("Logo mitra wajib diunggah");
  }

  if (file.size > maxUploadBytes) {
    throw new Error("Ukuran logo maksimal 5 MB");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("File logo harus berupa gambar");
  }

  const inputBuffer = Buffer.from(await file.arrayBuffer());
  const outputBuffer = await sharp(inputBuffer)
    .rotate()
    .resize({ width: 1200, height: 900, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82, effort: 4 })
    .toBuffer();
  const filename = `${randomUUID()}.webp`;
  const logoPath = `/storage/mitra/${filename}`;

  await mkdir(storageDirectory, { recursive: true });
  await writeFile(path.join(storageDirectory, filename), outputBuffer);

  return logoPath;
}

export async function removeClientLogo(logoPath) {
  if (!logoPath?.startsWith("/storage/mitra/")) return;
  const filename = path.basename(logoPath);
  await unlink(path.join(storageDirectory, filename)).catch(() => {});
}
