import { auth } from "@/auth";
import { fallbackContent } from "@/lib/content/siteContent";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "node:crypto";
import { removePortfolioMedia, savePortfolioMedia } from "@/lib/media/portfolioUpload";

function hasContentAccess(session) {
  return ["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(session?.user?.role);
}

async function requireContentAccess() {
  return hasContentAccess(await auth());
}

function slugify(value) {
  return String(value || "project").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "project";
}

function normalizeCaseStudy(item = {}) {
  return {
    id: String(item.id || ""),
    clientName: String(item.client || ""),
    title: String(item.title || ""),
    category: String(item.eyebrow || ""),
    description: String(item.description || ""),
    result: String(item.result || ""),
    instagram: String(item.instagram || ""),
    media: Array.isArray(item.media) ? item.media.map((media) => ({
      mediaType: media.type === "video" ? "VIDEO" : "IMAGE",
      section: media.channel?.toLowerCase().includes("behind") ? "BEHIND_SCENES" : "PORTFOLIO",
      filePath: String(media.upload?.filePath || media.src || ""),
      caption: String(media.caption || ""),
      altText: String(media.alt || ""),
      originalName: String(media.upload?.originalName || media.src?.split("/").pop() || ""),
      mimeType: String(media.upload?.mimeType || ""),
      fileSize: Number(media.upload?.fileSize || 0),
    })).filter((media) => media.filePath) : [],
  };
}

async function parseCaseStudyRequest(request) {
  if (request.headers.get("content-type")?.includes("multipart/form-data")) {
    const formData = await request.formData();
    const payload = JSON.parse(String(formData.get("caseStudy") || "{}"));
    const media = Array.isArray(payload.media) ? payload.media : [];
    const uploadedMedia = await Promise.all(media.map(async (item, index) => {
      const file = formData.get(`media-${index}`);
      if (!file || typeof file.arrayBuffer !== "function" || file.size === 0) return item;
      return { ...item, upload: await savePortfolioMedia(file) };
    }));
    return { ...payload, media: uploadedMedia };
  }
  return (await request.json()).caseStudy;
}

function toCaseStudy(project) {
  return {
    id: project.id,
    eyebrow: project.category || project.clientName,
    title: project.title,
    description: project.description,
    client: project.clientName,
    instagram: project.instagram,
    result: project.result,
    services: project.category ? [{ label: project.category, description: "", href: "" }] : [],
    media: project.media.map((media) => ({
      id: media.id,
      type: media.mediaType.toLowerCase(),
      channel: media.section === "BEHIND_SCENES" ? "Behind the scene" : "Portfolio",
      caption: media.caption,
      src: media.filePath,
      alt: media.altText,
      position: "center",
      href: "",
    })),
  };
}

async function listProjects() {
  return prisma.portfolioProject.findMany({
    where: { isPublished: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    include: { media: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] } },
  });
}

async function seedProjectsIfEmpty() {
  if (await prisma.portfolioProject.count() > 0) return;
  for (const [sortOrder, item] of fallbackContent.caseStudies.entries()) {
    const normalized = normalizeCaseStudy(item);
    await prisma.portfolioProject.create({
      data: {
        id: normalized.id || randomUUID(),
        clientName: normalized.clientName,
        title: normalized.title,
        slug: slugify(item.id || normalized.clientName),
        category: normalized.category,
        description: normalized.description,
        result: normalized.result,
        instagram: normalized.instagram,
        sortOrder,
        media: { create: normalized.media.map((media, mediaOrder) => ({ ...media, sortOrder: mediaOrder, originalName: media.filePath.split("/").pop() || "" })) },
      },
    });
  }
}

export async function listCaseStudiesController() {
  if (!await requireContentAccess()) return Response.json({ error: "Tidak memiliki akses" }, { status: 403 });
  try {
    await seedProjectsIfEmpty();
    return Response.json({ caseStudies: (await listProjects()).map(toCaseStudy) });
  } catch (error) {
    console.error("Failed to list case studies", error);
    return Response.json({ error: "Gagal mengambil studi kasus" }, { status: 500 });
  }
}

export async function saveCaseStudyController(request) {
  if (!await requireContentAccess()) return Response.json({ error: "Tidak memiliki akses" }, { status: 403 });
  try {
    const normalized = normalizeCaseStudy(await parseCaseStudyRequest(request));
    if (!normalized.clientName || !normalized.title) return Response.json({ error: "Nama klien dan judul wajib diisi" }, { status: 400 });
    const existing = normalized.id ? await prisma.portfolioProject.findUnique({ where: { id: normalized.id } }) : null;
    const projectId = existing?.id || randomUUID();
    const projects = await listProjects();
    const oldMedia = existing ? await prisma.portfolioMedia.findMany({ where: { projectId } }) : [];
    const saved = await prisma.$transaction(async (transaction) => {
      await transaction.portfolioMedia.deleteMany({ where: { projectId } });
      return transaction.portfolioProject.upsert({
        where: { id: projectId },
        update: { clientName: normalized.clientName, title: normalized.title, category: normalized.category, description: normalized.description, result: normalized.result, instagram: normalized.instagram, media: { create: normalized.media.map((media, sortOrder) => ({ ...media, sortOrder })) } },
        create: { id: projectId, clientName: normalized.clientName, title: normalized.title, slug: `${slugify(normalized.clientName)}-${randomUUID().slice(0, 8)}`, category: normalized.category, description: normalized.description, result: normalized.result, instagram: normalized.instagram, sortOrder: projects.length, media: { create: normalized.media.map((media, sortOrder) => ({ ...media, sortOrder })) } },
        include: { media: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] } },
      });
    });
    const currentPaths = new Set(normalized.media.map((media) => media.filePath));
    await Promise.all(oldMedia.filter((media) => !currentPaths.has(media.filePath)).map((media) => removePortfolioMedia(media.filePath)));
    return Response.json({ caseStudy: toCaseStudy(saved), caseStudies: (await listProjects()).map(toCaseStudy) });
  } catch (error) {
    console.error("Failed to save case study", error);
    return Response.json({ error: "Gagal menyimpan studi kasus" }, { status: 500 });
  }
}

export async function deleteCaseStudyController(request) {
  if (!await requireContentAccess()) return Response.json({ error: "Tidak memiliki akses" }, { status: 403 });
  try {
    const { id } = await request.json();
    if (!id) return Response.json({ error: "ID studi kasus wajib diisi" }, { status: 400 });
    const project = await prisma.portfolioProject.findUnique({ where: { id }, include: { media: true } });
    if (!project) return Response.json({ error: "Studi kasus tidak ditemukan" }, { status: 404 });
    await prisma.portfolioProject.delete({ where: { id } });
    await Promise.all(project.media.map((media) => removePortfolioMedia(media.filePath)));
    return Response.json({ caseStudies: (await listProjects()).map(toCaseStudy) });
  } catch (error) {
    if (error?.code === "P2025") return Response.json({ error: "Studi kasus tidak ditemukan" }, { status: 404 });
    console.error("Failed to delete case study", error);
    return Response.json({ error: "Gagal menghapus studi kasus" }, { status: 500 });
  }
}
