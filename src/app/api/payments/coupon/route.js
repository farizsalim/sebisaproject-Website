import { prisma } from "@/lib/prisma";
import { findUsableCoupon } from "@/lib/coupons/couponController";
import { z } from "zod";

const requestSchema = z.object({
  serviceId: z.string().cuid(),
  couponCode: z.string().trim().min(3).max(40),
});

function parsePrice(value) {
  const amount = Number(String(value).replace(/[^0-9]/g, ""));
  return Number.isSafeInteger(amount) && amount > 0 ? amount : null;
}

export async function POST(request) {
  try {
    const result = requestSchema.safeParse(await request.json());
    if (!result.success) return Response.json({ error: "Kode kupon belum lengkap." }, { status: 400 });

    const service = await prisma.service.findFirst({
      where: { id: result.data.serviceId, category: { isPublished: true } },
      select: { price: true },
    });
    if (!service) return Response.json({ error: "Layanan tidak ditemukan." }, { status: 404 });

    const originalAmount = parsePrice(service.price);
    if (!originalAmount) return Response.json({ error: "Harga layanan belum valid." }, { status: 400 });

    const { coupon, discountAmount } = await findUsableCoupon(result.data.couponCode, originalAmount);
    return Response.json({
      couponCode: coupon.code,
      originalAmount,
      discountAmount,
      totalAmount: originalAmount - discountAmount,
    });
  } catch (error) {
    return Response.json({ error: error.message || "Kupon tidak dapat digunakan." }, { status: 400 });
  }
}
