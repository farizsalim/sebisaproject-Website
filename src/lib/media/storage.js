import path from "node:path";

export const storageRoot = path.join(process.cwd(), "storage");

export function storageDirectory(section) {
  return path.join(storageRoot, section);
}

export function storageUrl(section, filename) {
  return `/api/media/${section}/${filename}`;
}

export function getSafeStoragePath(segments) {
  const relativePath = segments.join("/");
  if (!relativePath || relativePath.includes("..") || path.isAbsolute(relativePath)) return null;

  const filePath = path.resolve(storageRoot, relativePath);
  return filePath.startsWith(`${path.resolve(storageRoot)}${path.sep}`) ? filePath : null;
}
