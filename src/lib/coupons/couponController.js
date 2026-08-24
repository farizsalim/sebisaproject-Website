import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const couponInput = z.object({
  code: z.string().trim().min(3).max(40).transform((value) => value.toUpperCase()),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.number().int().positive(),
  minAmount: z.number().int().min(0).default(0),
  maxUses: z.number().int().positive().nullable().default(null),
  isActive: z.boolean().default(true),
  startsAt: z.union([z.string().datetime({ offset: true }), z.literal(""), z.null()]).default(null),
  expiresAt: z.union([z.string().datetime({ offset: true }), z.literal(""), z.null()]).default(null),
}).superRefine((coupon, context) => {
  if (coupon.type === "PERCENTAGE" && coupon.value > 100) {
    context.addIssue({ code: "custom", path: ["value"], message: "Diskon persentase maksimal 100%." });
  }
});

function hasAccess(session) {
  return ["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(session?.user?.role);
}

function serializeCoupon(coupon) {
  return {
    ...coupon,
    startsAt: coupon.startsAt?.toISOString() || null,
    expiresAt: coupon.expiresAt?.toISOString() || null,
  };
}

export async function listCouponsController() {
  if (!hasAccess(await auth())) return Response.json({ error: "Tidak memiliki akses" }, { status: 403 });
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return Response.json({ coupons: coupons.map(serializeCoupon) });
}

export async function createCouponController(request) {
  if (!hasAccess(await auth())) return Response.json({ error: "Tidak memiliki akses" }, { status: 403 });
  const result = couponInput.safeParse(await request.json());
  if (!result.success) return Response.json({ error: result.error.issues[0]?.message || "Format kupon tidak valid" }, { status: 400 });
  try {
    const data = result.data;
    const coupon = await prisma.coupon.create({
      data: {
        ...data,
        startsAt: data.startsAt ? new Date(data.startsAt) : null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
    });
    return Response.json({ coupon: serializeCoupon(coupon) }, { status: 201 });
  } catch (error) {
    if (error?.code === "P2002") return Response.json({ error: "Kode kupon sudah digunakan." }, { status: 409 });
    console.error("Failed to create coupon", error);
    return Response.json({ error: "Gagal membuat kupon." }, { status: 500 });
  }
}

export async function updateCouponController(request) {
  if (!hasAccess(await auth())) return Response.json({ error: "Tidak memiliki akses" }, { status: 403 });
  const body = await request.json();
  const id = z.string().cuid().safeParse(body.id);
  const result = couponInput.safeParse(body);
  if (!id.success || !result.success) return Response.json({ error: "Data kupon tidak valid." }, { status: 400 });
  try {
    const data = result.data;
    const coupon = await prisma.coupon.update({
      where: { id: id.data },
      data: {
        ...data,
        startsAt: data.startsAt ? new Date(data.startsAt) : null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
    });
    return Response.json({ coupon: serializeCoupon(coupon) });
  } catch (error) {
    console.error("Failed to update coupon", error);
    return Response.json({ error: "Gagal memperbarui kupon." }, { status: 500 });
  }
}

export async function deleteCouponController(request) {
  if (!hasAccess(await auth())) return Response.json({ error: "Tidak memiliki akses" }, { status: 403 });
  const body = await request.json();
  const id = z.string().cuid().safeParse(body.id);
  if (!id.success) return Response.json({ error: "ID kupon tidak valid." }, { status: 400 });
  await prisma.coupon.update({ where: { id: id.data }, data: { isActive: false } });
  return Response.json({ success: true });
}

export function calculateCouponDiscount(coupon, amount) {
  if (coupon.type === "PERCENTAGE") return Math.floor(amount * coupon.value / 100);
  return Math.min(coupon.value, amount);
}

export async function findUsableCoupon(code, amount) {
  const normalizedCode = String(code || "").trim().toUpperCase();
  if (!normalizedCode) return { coupon: null, discountAmount: 0 };
  const coupon = await prisma.coupon.findUnique({ where: { code: normalizedCode } });
  const now = new Date();
  if (!coupon) throw new Error("Kode kupon tidak ditemukan.");
  if (!coupon.isActive) throw new Error("Kupon sedang nonaktif.");
  if (coupon.startsAt && now < coupon.startsAt) throw new Error("Kupon belum mulai berlaku.");
  if (coupon.expiresAt && now > coupon.expiresAt) throw new Error("Masa berlaku kupon sudah berakhir.");
  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) throw new Error("Batas penggunaan kupon sudah tercapai.");
  if (amount < coupon.minAmount) throw new Error("Minimum pembelian untuk kupon ini belum tercapai.");
  const discountAmount = calculateCouponDiscount(coupon, amount);
  return { coupon, discountAmount };
}
