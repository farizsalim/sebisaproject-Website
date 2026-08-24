import { prisma } from "@/lib/prisma";
import { z } from "zod";

const submissionSchema = z.object({
  name: z.string().trim().min(2).max(120),
  business: z.string().trim().min(2).max(160),
  whatsapp: z.string().trim().regex(/^\+?[0-9\s-]{10,20}$/),
  answers: z.array(z.string().trim().min(1).max(200)).min(1).max(20),
  recommendations: z.array(z.string().trim().min(1).max(160)).min(1).max(10),
  quizId: z.string().cuid().optional().nullable(),
  quizVersion: z.number().int().positive().optional().nullable(),
});

export async function POST(request) {
  try {
    const body = await request.json();
    const result = submissionSchema.safeParse(body);

    if (!result.success) {
      return Response.json({ error: "Lengkapi biodata dan jawaban dengan format yang benar." }, { status: 400 });
    }

    const submission = await prisma.consultationSubmission.create({ data: result.data });
    return Response.json({ id: submission.id }, { status: 201 });
  } catch (error) {
    console.error("Failed to save consultation submission", error);
    return Response.json({ error: "Data konsultasi belum dapat disimpan." }, { status: 500 });
  }
}