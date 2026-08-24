import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { fallbackContent } from "@/lib/content/siteContent";
import { z } from "zod";

const contentPayloadSchema = z.object({
  value: z.unknown(),
  isPublished: z.boolean().optional().default(true),
});

const contentOrder = ["navbar", "hero", "consultationQuiz", "clients", "about", "faq", "finalCta", "footer"];

function hasContentAccess(session) {
  return ["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(session?.user?.role);
}

async function requireContentAccess() {
  const session = await auth();
  return hasContentAccess(session) ? session : null;
}

export async function listContentController() {
  if (!await requireContentAccess()) {
    return Response.json({ error: "Tidak memiliki akses" }, { status: 403 });
  }

  try {
    const quizContent = await prisma.siteContent.findUnique({
      where: { contentKey: "consultationQuiz" },
      select: { id: true },
    });

    if (!quizContent) {
      await prisma.siteContent.create({
        data: {
          contentKey: "consultationQuiz",
          value: fallbackContent.consultationQuiz,
          isPublished: true,
        },
      });
    } else {
      const storedQuiz = await prisma.siteContent.findUnique({
        where: { contentKey: "consultationQuiz" },
        select: { id: true, value: true },
      });
      if (storedQuiz.value?.flow?.version !== 3) {
        await prisma.siteContent.update({
          where: { id: storedQuiz.id },
          data: { value: fallbackContent.consultationQuiz },
        });
      } else if (!storedQuiz.value?.scoringRules) {
        await prisma.siteContent.update({
          where: { id: storedQuiz.id },
          data: {
            value: {
              ...storedQuiz.value,
              scoringRules: fallbackContent.consultationQuiz.scoringRules,
            },
          },
        });
      }
    }

    const content = await prisma.siteContent.findMany({
      where: { contentKey: { not: "services" } },
    });
    content.sort((first, second) => {
      const firstIndex = contentOrder.indexOf(first.contentKey);
      const secondIndex = contentOrder.indexOf(second.contentKey);
      return (firstIndex === -1 ? contentOrder.length : firstIndex) - (secondIndex === -1 ? contentOrder.length : secondIndex);
    });

    return Response.json({ content });
  } catch (error) {
    console.error("Failed to list site content", error);
    return Response.json({ error: "Gagal mengambil konten website" }, { status: 500 });
  }
}

export async function updateContentController(request) {
  if (!await requireContentAccess()) {
    return Response.json({ error: "Tidak memiliki akses" }, { status: 403 });
  }

  const body = await request.json();
  const result = contentPayloadSchema.safeParse(body);
  if (!result.success || !body.id) {
    return Response.json({ error: "Format konten tidak valid" }, { status: 400 });
  }

  try {
    const content = await prisma.siteContent.update({
      where: { id: body.id },
      data: result.data,
    });
    return Response.json({ content });
  } catch (error) {
    if (error?.code === "P2025") {
      return Response.json({ error: "Konten tidak ditemukan" }, { status: 404 });
    }
    return Response.json({ error: "Gagal memperbarui konten" }, { status: 500 });
  }
}
