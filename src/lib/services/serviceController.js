import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const serviceSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string().trim().min(1, "Nama layanan wajib diisi").max(160),
  originalPrice: z.string().trim().max(80).default(""),
  price: z.string().trim().min(1, "Harga layanan wajib diisi").max(80),
  duration: z.string().trim().max(80).default(""),
  description: z.string().trim().min(1, "Deskripsi wajib diisi").max(500),
  benefits: z.array(z.string().trim().min(1).max(160)).max(20).default([]),
  isRecommended: z.boolean().default(false),
  flashSale: z.boolean().default(false),
  discount: z.number().int().min(0).max(100).default(0),
  flashSaleEndsAt: z.union([z.string().datetime({ offset: true }), z.literal(""), z.null()]).optional().default(null),
}).superRefine((service, context) => {
  if (service.flashSale && !service.originalPrice) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["originalPrice"], message: "Harga awal wajib diisi saat Flash Sale aktif" });
  }
  const originalAmount = parsePrice(service.originalPrice);
  const saleAmount = parsePrice(service.price);
  if (service.flashSale && originalAmount && saleAmount && saleAmount >= originalAmount) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["price"], message: "Harga promo harus lebih rendah dari harga awal" });
  }
  if (!service.flashSale && (service.discount > 0 || service.flashSaleEndsAt)) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["flashSale"], message: "Aktifkan Flash Sale untuk mengisi pengaturan promo" });
  }
});

const groupSchema = z.object({
  id: z.string().trim().min(1).max(100),
  category: z.string().trim().min(1).max(100),
  icon: z.string().trim().min(1).max(30).default("chart"),
  services: z.array(serviceSchema).max(100),
});

const servicesSchema = z.array(groupSchema).max(30);

function parsePrice(value) {
  const amount = Number(String(value).replace(/[^0-9]/g, ""));
  return Number.isSafeInteger(amount) && amount > 0 ? amount : null;
}

function calculateDiscount(originalPrice, salePrice) {
  const originalAmount = parsePrice(originalPrice);
  const saleAmount = parsePrice(salePrice);
  if (!originalAmount || !saleAmount || saleAmount >= originalAmount) return 0;
  return Math.round(((originalAmount - saleAmount) / originalAmount) * 100);
}

function hasServiceAccess(session) {
  return ["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(session?.user?.role);
}

async function requireServiceAccess() {
  const session = await auth();
  return hasServiceAccess(session) ? session : null;
}

function serializeCategories(categories) {
  return categories.map((category) => ({
    id: category.id,
    category: category.category,
    icon: category.icon,
    services: category.services.map((service) => ({
      id: service.id,
      name: service.name,
      originalPrice: service.originalPrice,
      price: service.price,
      duration: service.duration,
      description: service.description,
      benefits: service.benefits,
      isRecommended: service.isRecommended,
      flashSale: service.flashSale,
      discount: service.discount,
      flashSaleEndsAt: service.flashSaleEndsAt?.toISOString() || null,
    })),
  }));
}

async function findServiceCategories() {
  return prisma.serviceCategory.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    include: { services: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] } },
  });
}

export async function listServicesController() {
  if (!await requireServiceAccess()) {
    return Response.json({ error: "Tidak memiliki akses" }, { status: 403 });
  }

  try {
    const categories = await findServiceCategories();
    return Response.json({ services: serializeCategories(categories), isPublished: categories.every((category) => category.isPublished) });
  } catch (error) {
    console.error("Failed to list services", error);
    return Response.json({ error: "Gagal mengambil data layanan" }, { status: 500 });
  }
}

export async function updateServicesController(request) {
  if (!await requireServiceAccess()) {
    return Response.json({ error: "Tidak memiliki akses" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const result = servicesSchema.safeParse(body.services);
    if (!result.success) {
      return Response.json({ error: result.error.issues[0]?.message || "Format layanan tidak valid" }, { status: 400 });
    }

    const normalizedServices = result.data.map((category) => ({
      ...category,
      services: category.services.map((service) => ({
        ...service,
        discount: service.flashSale ? calculateDiscount(service.originalPrice, service.price) : 0,
      })),
    }));
    const isPublished = body.isPublished !== false;
    await prisma.$transaction(async (transaction) => {
      const existingCategories = await transaction.serviceCategory.findMany({ include: { services: { select: { id: true } } } });
      const existingServiceIds = existingCategories.flatMap((category) => category.services.map((service) => service.id));
      const submittedServiceIds = normalizedServices.flatMap((category) => category.services.map((service) => service.id).filter(Boolean));

      for (const [categoryIndex, category] of normalizedServices.entries()) {
        await transaction.serviceCategory.upsert({
          where: { id: category.id },
          update: { category: category.category, icon: category.icon, isPublished, sortOrder: categoryIndex },
          create: { id: category.id, category: category.category, icon: category.icon, isPublished, sortOrder: categoryIndex },
        });
        for (const [serviceIndex, service] of category.services.entries()) {
          const serviceData = {
            categoryId: category.id,
            name: service.name,
            originalPrice: service.originalPrice,
            price: service.price,
            duration: service.duration,
            description: service.description,
            benefits: service.benefits,
            isRecommended: service.isRecommended,
            flashSale: service.flashSale,
            discount: service.discount,
            flashSaleEndsAt: service.flashSaleEndsAt ? new Date(service.flashSaleEndsAt) : null,
            sortOrder: serviceIndex,
          };
          if (service.id) {
            await transaction.service.update({ where: { id: service.id }, data: serviceData });
          } else {
            await transaction.service.create({ data: serviceData });
          }
        }
      }

      for (const serviceId of existingServiceIds.filter((id) => !submittedServiceIds.includes(id))) {
        const [paymentCount, scoreCount] = await Promise.all([
          transaction.paymentOrder.count({ where: { serviceId } }),
          transaction.consultationQuizOptionScore.count({ where: { serviceId } }),
        ]);
        if (paymentCount || scoreCount) {
          throw new Error("Layanan yang sudah dipakai transaksi atau kuis tidak dapat dihapus.");
        }
        await transaction.service.delete({ where: { id: serviceId } });
      }

      for (const category of existingCategories.filter((item) => !normalizedServices.some((next) => next.id === item.id))) {
        const remainingServices = await transaction.service.count({ where: { categoryId: category.id } });
        if (remainingServices) throw new Error("Kategori masih memiliki layanan dan tidak dapat dihapus.");
        await transaction.serviceCategory.delete({ where: { id: category.id } });
      }
    });
    const savedCategories = await findServiceCategories();
    return Response.json({ services: serializeCategories(savedCategories), isPublished });
  } catch (error) {
    console.error("Failed to update services", error);
    return Response.json({ error: error.message || "Gagal menyimpan data layanan" }, { status: 500 });
  }
}
