import { readFile } from "node:fs/promises";
import path from "node:path";
import { getSafeStoragePath } from "@/lib/media/storage";

const contentTypes = {
  ".avif": "image/avif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(_request, { params }) {
  const { path: mediaPath } = await params;
  const filePath = getSafeStoragePath(mediaPath);
  if (!filePath) return new Response("Not found", { status: 404 });

  try {
    const file = await readFile(filePath);
    const contentType = contentTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream";
    return new Response(file, {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Type": contentType,
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
