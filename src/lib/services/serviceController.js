import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import fallbackServices from "../../../public/data/services.json";
import { z } from "zod";

const serviceSchema = z.object({
  name: z.string().trim().min(1, "Nama layanan wajib diisi").max(160),
  originalPrice: z.string().trim().max(80).default(""),
  price: z.string().trim().min(1, "Harga promo wajib diisi").max(80),
  duration: z.string().trim().max(80).default(""),
  description: z.string().trim().min(1, "Deskripsi wajib diisi").max(500),
  benefits: z.array(z.string().trim().min(1).max(160)).max(20).default([]),
  isRecommended: z.boolean().default(false),
  flashSale: z.boolean().default(false),
  discount: z.number().int().min(0).max(100).default(0),
  flashSaleEndsAt: z.union([z.string().datetime({ offset: true }), z.literal(""), z.null()]).optional().default(null),
});

const groupSchema = z.object({
  id: z.string().trim().min(1).max(100),
  category: z.string().trim().min(1).max(100),
  icon: z.string().trim().min(1).max(30).default("chart"),
  services: z.array(serviceSchema).max(100),
});

const servicesSchema = z.array(groupSchema).max(30);

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
    return Response.json({ services: categories.length > 0 ? serializeCategories(categories) : fallbackServices, isPublished: categories.every((category) => category.isPublished) });
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

    const isPublished = body.isPublished !== false;
    await prisma.$transaction(async (transaction) => {
      await transaction.service.deleteMany();
      await transaction.serviceCategory.deleteMany();

      for (const [categoryIndex, category] of result.data.entries()) {
        await transaction.serviceCategory.create({
          data: {
            id: category.id,
            category: category.category,
            icon: category.icon,
            isPublished,
            sortOrder: categoryIndex,
            services: {
              create: category.services.map((service, serviceIndex) => ({
                ...service,
                flashSaleEndsAt: service.flashSaleEndsAt ? new Date(service.flashSaleEndsAt) : null,
                sortOrder: serviceIndex,
              })),
            },
          },
        });
      }
    });
    return Response.json({ services: result.data, isPublished });
  } catch (error) {
    console.error("Failed to update services", error);
    return Response.json({ error: "Gagal menyimpan data layanan" }, { status: 500 });
  }
}
