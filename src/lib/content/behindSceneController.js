import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { parseBehindSceneUpload, removeBehindScene, saveBehindScene } from "@/lib/media/behindSceneUpload";

async function hasAccess() {
  const session = await auth();
  return ["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(session?.user?.role);
}

function toBehindScene(item) {
  return {
    id: item.id,
    type: item.mediaType.toLowerCase(),
    src: item.filePath,
    caption: item.description,
    alt: item.altText,
    sortOrder: item.sortOrder,
    isPublished: item.isPublished,
    originalName: item.originalName,
  };
}

export async function listBehindScenesController() {
  if (!await hasAccess()) return Response.json({ error: "Tidak memiliki akses" }, { status: 403 });
  const items = await prisma.behindScene.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
  return Response.json({ behindScenes: items.map(toBehindScene) });
}

export async function createBehindSceneController(request) {
  if (!await hasAccess()) return Response.json({ error: "Tidak memiliki akses" }, { status: 403 });
  try {
    const formData = await request.clone().formData();
    const file = await parseBehindSceneUpload(request);
    const description = String(formData.get("description") || "").trim();
    if (!description) return Response.json({ error: "Deskripsi wajib diisi" }, { status: 400 });
    const savedFile = await saveBehindScene(file);
    const behindScene = await prisma.behindScene.create({
      data: {
        mediaType: savedFile.mimeType.startsWith("video/") ? "VIDEO" : "IMAGE",
        ...savedFile,
        originalName: file.originalname,
        description,
        altText: String(formData.get("altText") || description).trim(),
        sortOrder: Number(formData.get("sortOrder") || 0),
        isPublished: formData.get("isPublished") !== "false",
      },
    });
    return Response.json({ behindScene: toBehindScene(behindScene) }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message || "Gagal menyimpan behind the scenes" }, { status: 400 });
  }
}

export async function updateBehindSceneController(request) {
  if (!await hasAccess()) return Response.json({ error: "Tidak memiliki akses" }, { status: 403 });
  try {
    const formData = await request.clone().formData();
    const id = String(formData.get("id") || "");
    const description = String(formData.get("description") || "").trim();
    if (!id || !description) return Response.json({ error: "ID dan deskripsi wajib diisi" }, { status: 400 });

    const existing = await prisma.behindScene.findUnique({ where: { id } });
    if (!existing) return Response.json({ error: "Dokumentasi tidak ditemukan" }, { status: 404 });

    const file = await parseBehindSceneUpload(request);
    let fileData = {};
    if (file?.buffer) {
      fileData = await saveBehindScene(file);
      await removeBehindScene(existing.filePath);
    }

    const behindScene = await prisma.behindScene.update({
      where: { id },
      data: {
        ...fileData,
        ...(file ? { mediaType: fileData.mimeType.startsWith("video/") ? "VIDEO" : "IMAGE", originalName: file.originalname } : {}),
        description,
        altText: String(formData.get("altText") || description).trim(),
        sortOrder: Number(formData.get("sortOrder") || existing.sortOrder),
        isPublished: formData.get("isPublished") !== "false",
      },
    });
    return Response.json({ behindScene: toBehindScene(behindScene) });
  } catch (error) {
    return Response.json({ error: error.message || "Gagal memperbarui behind the scenes" }, { status: 400 });
  }
}

export async function deleteBehindSceneController(request) {
  if (!await hasAccess()) return Response.json({ error: "Tidak memiliki akses" }, { status: 403 });
  try {
    const { id } = await request.json();
    const item = await prisma.behindScene.delete({ where: { id } });
    await removeBehindScene(item.filePath);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error?.code === "P2025" ? "Media tidak ditemukan" : "Gagal menghapus media" }, { status: 400 });
  }
}
