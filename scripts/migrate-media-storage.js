import { access, copyFile, mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client.ts";

const projectRoot = process.cwd();
const legacyRoot = path.join(projectRoot, "public", "storage");
const legacyClientRoot = path.join(projectRoot, "public", "Client");
const publicRoot = path.join(projectRoot, "public");
const storageRoot = path.join(projectRoot, "storage");
const legacySections = ["mitra", "behind-scenes", "portfolio"];
const shouldDeleteLegacy = process.argv.includes("--delete-legacy");
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is not configured");
const connectionUrl = new URL(databaseUrl);
const prisma = new PrismaClient({
  adapter: new PrismaMariaDb({
    host: connectionUrl.hostname,
    port: Number(connectionUrl.port || 3306),
    user: decodeURIComponent(connectionUrl.username),
    password: decodeURIComponent(connectionUrl.password),
    database: connectionUrl.pathname.slice(1),
  }),
});

function storageUrl(section, filename) {
  return `/api/media/${section}/${filename}`;
}

async function migratePath(filePath, section) {
  const prefix = `/storage/${section}/`;
  if (!filePath?.startsWith(prefix)) return null;

  const filename = path.basename(filePath);
  const sourcePath = path.join(legacyRoot, section, filename);
  const targetDirectory = path.join(storageRoot, section);
  const targetPath = path.join(targetDirectory, filename);
  try {
    await access(sourcePath);
  } catch {
    console.warn(`Skipped missing file: ${sourcePath}`);
    return null;
  }

  await mkdir(targetDirectory, { recursive: true });
  await copyFile(sourcePath, targetPath);
  return { oldPath: filePath, newPath: storageUrl(section, filename), sourcePath };
}

async function migrateClientPath(filePath) {
  if (!filePath?.startsWith("/Client/")) return null;

  const filename = path.basename(filePath);
  const sourcePath = path.join(legacyClientRoot, filename);
  const targetDirectory = path.join(storageRoot, "mitra");
  const targetPath = path.join(targetDirectory, filename);
  try {
    await access(sourcePath);
  } catch {
    console.warn(`Skipped missing file: ${sourcePath}`);
    return null;
  }

  await mkdir(targetDirectory, { recursive: true });
  await copyFile(sourcePath, targetPath);
  return { oldPath: filePath, newPath: storageUrl("mitra", filename), sourcePath };
}

async function migratePortfolioPath(filePath) {
  if (!filePath?.startsWith("/") || filePath.startsWith("/api/media/") || filePath.startsWith("/storage/")) return null;

  const relativePath = decodeURIComponent(filePath).replace(/^\/+/, "");
  if (relativePath.includes("..") || path.isAbsolute(relativePath)) return null;

  const sourcePath = path.resolve(publicRoot, relativePath);
  if (!sourcePath.startsWith(`${path.resolve(publicRoot)}${path.sep}`)) return null;
  try {
    await access(sourcePath);
  } catch {
    console.warn(`Skipped missing portfolio file: ${sourcePath}`);
    return null;
  }

  const extension = path.extname(sourcePath).toLowerCase() || ".bin";
  const filename = `${randomUUID()}${extension}`;
  const targetDirectory = path.join(storageRoot, "portfolio");
  const targetPath = path.join(targetDirectory, filename);
  await mkdir(targetDirectory, { recursive: true });
  await copyFile(sourcePath, targetPath);
  return { oldPath: filePath, newPath: storageUrl("portfolio", filename), sourcePath };
}

async function migrateTeamPath(filePath) {
  if (!filePath?.startsWith("/data/team/")) return null;

  const relativePath = decodeURIComponent(filePath).replace(/^\/+/, "");
  const sourcePath = path.resolve(publicRoot, relativePath);
  if (!sourcePath.startsWith(`${path.resolve(publicRoot)}${path.sep}`)) return null;
  try {
    await access(sourcePath);
  } catch {
    console.warn(`Skipped missing team file: ${sourcePath}`);
    return null;
  }

  const extension = path.extname(sourcePath).toLowerCase() || ".bin";
  const filename = `${randomUUID()}${extension}`;
  const targetDirectory = path.join(storageRoot, "team");
  await mkdir(targetDirectory, { recursive: true });
  await copyFile(sourcePath, path.join(targetDirectory, filename));
  return { oldPath: filePath, newPath: storageUrl("team", filename), sourcePath };
}

async function syncPortfolioFallback() {
  const fallbackPath = path.join(publicRoot, "data", "case-studies.json");
  const fallback = JSON.parse(await readFile(fallbackPath, "utf8"));
  const projects = await prisma.portfolioProject.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    include: { media: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] } },
  });
  const updated = fallback.map((project, projectIndex) => ({
    ...project,
    media: project.media.map((item, mediaIndex) => ({ ...item, src: projects[projectIndex]?.media[mediaIndex]?.filePath || item.src })),
  }));
  await writeFile(fallbackPath, `${JSON.stringify(updated, null, 2)}\n`);
}

async function main() {
  const changes = [];
  await Promise.all(legacySections.map((section) => mkdir(path.join(storageRoot, section), { recursive: true })));
  const clients = await prisma.client.findMany({ select: { id: true, logoPath: true } });
  for (const client of clients) {
    const change = client.logoPath?.startsWith("/Client/")
      ? await migrateClientPath(client.logoPath)
      : await migratePath(client.logoPath, "mitra");
    if (change) changes.push({ type: "client", id: client.id, ...change });
  }

  const behindScenes = await prisma.behindScene.findMany({ select: { id: true, filePath: true } });
  for (const item of behindScenes) {
    const change = await migratePath(item.filePath, "behind-scenes");
    if (change) changes.push({ type: "behindScene", id: item.id, ...change });
  }

  const portfolioMedia = await prisma.portfolioMedia.findMany({ select: { id: true, filePath: true } });
  for (const item of portfolioMedia) {
    const section = legacySections.find((candidate) => item.filePath?.startsWith(`/storage/${candidate}/`));
    const change = section ? await migratePath(item.filePath, section) : await migratePortfolioPath(item.filePath);
    if (change) changes.push({ type: "portfolioMedia", id: item.id, ...change });
  }

  const teamMembers = await prisma.teamMember.findMany({ select: { id: true, imagePath: true } });
  for (const member of teamMembers) {
    const change = await migrateTeamPath(member.imagePath);
    if (change) changes.push({ type: "teamMember", id: member.id, ...change });
  }

  await prisma.$transaction([
    ...changes.filter((change) => change.type === "client").map((change) => prisma.client.update({ where: { id: change.id }, data: { logoPath: change.newPath } })),
    ...changes.filter((change) => change.type === "behindScene").map((change) => prisma.behindScene.update({ where: { id: change.id }, data: { filePath: change.newPath } })),
    ...changes.filter((change) => change.type === "portfolioMedia").map((change) => prisma.portfolioMedia.update({ where: { id: change.id }, data: { filePath: change.newPath } })),
    ...changes.filter((change) => change.type === "teamMember").map((change) => prisma.teamMember.update({ where: { id: change.id }, data: { imagePath: change.newPath } })),
  ]);

  if (shouldDeleteLegacy) {
    for (const change of changes) await unlink(change.sourcePath).catch(() => {});
  }

  await syncPortfolioFallback();

  console.log(`Migrated ${changes.length} media reference(s).`);
  console.log(shouldDeleteLegacy ? "Legacy files deleted." : "Legacy files kept. Run with --delete-legacy only after verification.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(async () => {
  await prisma.$disconnect();
});
