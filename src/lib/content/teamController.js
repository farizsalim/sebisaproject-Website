import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { removeTeamImage, saveTeamImage } from "@/lib/media/teamUpload";

async function allowed() { return ["SUPER_ADMIN", "ADMIN", "EDITOR"].includes((await auth())?.user?.role); }
function shape(groups) { return groups.map((group) => ({ id: group.id, name: group.name, description: group.description, sortOrder: group.sortOrder, members: group.members.map((member) => ({ id: member.id, name: member.name, role: member.role, description: member.description, image: member.imagePath, sortOrder: member.sortOrder })) })); }
async function list() { return prisma.teamGroup.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }], include: { members: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] } } }); }

export async function listTeamsController() { if (!await allowed()) return Response.json({ error: "Tidak memiliki akses" }, { status: 403 }); return Response.json({ teams: shape(await list()) }); }
export async function saveTeamsController(request) {
  if (!await allowed()) return Response.json({ error: "Tidak memiliki akses" }, { status: 403 });
  try {
    const formData = await request.formData();
    const teams = JSON.parse(String(formData.get("teams") || "[]"));
    const existing = await list();
    const uploaded = [];
    for (const [groupIndex, group] of teams.entries()) for (const [memberIndex, member] of (group.members || []).entries()) {
      const file = formData.get(`member-${groupIndex}-${memberIndex}`);
      if (file?.size) { member.image = await saveTeamImage(file); uploaded.push(member.image); }
    }
    await prisma.$transaction(async (transaction) => {
      await transaction.teamGroup.deleteMany();
      for (const [groupIndex, group] of teams.entries()) await transaction.teamGroup.create({ data: { name: String(group.name || ""), description: String(group.description || ""), sortOrder: groupIndex, members: { create: (group.members || []).map((member, memberIndex) => ({ name: String(member.name || ""), role: String(member.role || ""), description: String(member.description || ""), imagePath: member.image || null, sortOrder: memberIndex })) } } });
    });
    const kept = new Set(teams.flatMap((group) => (group.members || []).map((member) => member.image).filter(Boolean)));
    await Promise.all(existing.flatMap((group) => group.members).filter((member) => member.imagePath && !kept.has(member.imagePath)).map((member) => removeTeamImage(member.imagePath)));
    return Response.json({ teams: shape(await list()) });
  } catch (error) { return Response.json({ error: error.message || "Gagal menyimpan data tim" }, { status: 400 }); }
}