import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { storageDirectory, storageUrl } from "@/lib/media/storage";

const directory = storageDirectory("team");

export async function saveTeamImage(file) {
  if (!file || typeof file.arrayBuffer !== "function" || !file.type.startsWith("image/")) throw new Error("Foto anggota harus berupa gambar");
  if (file.size > 5 * 1024 * 1024) throw new Error("Ukuran foto maksimal 5 MB");
  const output = await sharp(Buffer.from(await file.arrayBuffer())).rotate().resize({ width: 1200, height: 1200, fit: "cover" }).webp({ quality: 82 }).toBuffer();
  const filename = `${randomUUID()}.webp`;
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, filename), output);
  return storageUrl("team", filename);
}

export async function removeTeamImage(imagePath) {
  if (imagePath?.startsWith("/api/media/team/")) await unlink(path.join(directory, path.basename(imagePath))).catch(() => {});
}