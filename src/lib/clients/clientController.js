import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { removeClientLogo, saveClientLogo } from "@/lib/media/imageUpload";
import { z } from "zod";

const clientPayloadSchema = z.object({
  name: z.string().trim().min(1, "Nama mitra wajib diisi").max(120),
  websiteUrl: z.union([z.string().url(), z.literal("")]).optional().default(""),
  isPublished: z.boolean().default(true),
  sortOrder: z.number().int().min(0).max(9999).default(0),
});

function hasClientAccess(session) {
  return ["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(session?.user?.role);
}

async function requireClientAccess() {
  const session = await auth();
  return hasClientAccess(session) ? session : null;
}

function parseFormData(formData) {
  return clientPayloadSchema.safeParse({
    name: formData.get("name"),
    websiteUrl: formData.get("websiteUrl") || "",
    isPublished: formData.get("isPublished") !== "false",
    sortOrder: Number(formData.get("sortOrder") || 0),
  });
}

export async function listClientsController() {
  if (!await requireClientAccess()) {
    return Response.json({ error: "Tidak memiliki akses" }, { status: 403 });
  }

  try {
    const clients = await prisma.client.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    return Response.json({ clients });
  } catch (error) {
    console.error("Failed to list clients", error);
    return Response.json({ error: "Gagal mengambil data mitra" }, { status: 500 });
  }
}

export async function createClientController(request) {
  if (!await requireClientAccess()) {
    return Response.json({ error: "Tidak memiliki akses" }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const result = parseFormData(formData);
    if (!result.success) {
      return Response.json({ error: result.error.issues[0]?.message || "Data mitra tidak valid" }, { status: 400 });
    }

    const logoPath = await saveClientLogo(formData.get("logo"));
    const client = await prisma.client.create({
      data: { ...result.data, logoPath },
    });
    return Response.json({ client }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message || "Gagal menambahkan mitra" }, { status: 400 });
  }
}

export async function updateClientController(request) {
  if (!await requireClientAccess()) {
    return Response.json({ error: "Tidak memiliki akses" }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const id = formData.get("id");
    if (!id) return Response.json({ error: "ID mitra wajib diisi" }, { status: 400 });

    const result = parseFormData(formData);
    if (!result.success) {
      return Response.json({ error: result.error.issues[0]?.message || "Data mitra tidak valid" }, { status: 400 });
    }

    const existingClient = await prisma.client.findUnique({ where: { id } });
    if (!existingClient) return Response.json({ error: "Mitra tidak ditemukan" }, { status: 404 });

    const logo = formData.get("logo");
    let logoPath = existingClient.logoPath;
    if (logo && typeof logo.arrayBuffer === "function" && logo.size > 0) {
      logoPath = await saveClientLogo(logo);
      await removeClientLogo(existingClient.logoPath);
    }

    const client = await prisma.client.update({
      where: { id },
      data: { ...result.data, logoPath },
    });
    return Response.json({ client });
  } catch (error) {
    return Response.json({ error: error.message || "Gagal memperbarui mitra" }, { status: 400 });
  }
}

export async function deleteClientController(request) {
  if (!await requireClientAccess()) {
    return Response.json({ error: "Tidak memiliki akses" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const existingClient = await prisma.client.findUnique({ where: { id: body.id } });
    if (!existingClient) return Response.json({ error: "Mitra tidak ditemukan" }, { status: 404 });

    await prisma.client.delete({ where: { id: body.id } });
    await removeClientLogo(existingClient.logoPath);
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Gagal menghapus mitra" }, { status: 400 });
  }
}
