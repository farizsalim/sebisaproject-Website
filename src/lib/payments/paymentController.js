import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const successfulStatuses = ["SETTLEMENT", "CAPTURE"];
const failedStatuses = ["DENY", "CANCEL", "EXPIRE", "REFUND", "UNKNOWN"];

function hasAccess(session) {
  return ["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(session?.user?.role);
}

function serializeOrder(order) {
  return {
    id: order.id,
    orderId: order.orderId,
    service: order.service?.name || "Layanan dihapus",
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    grossAmount: order.grossAmount,
    discountAmount: order.discountAmount,
    couponCode: order.couponCode,
    status: order.status,
    paymentType: order.paymentType,
    transactionId: order.transactionId,
    createdAt: order.createdAt.toISOString(),
    paidAt: order.paidAt?.toISOString() || null,
  };
}

export async function listPaymentsController() {
  if (!hasAccess(await auth())) return Response.json({ error: "Tidak memiliki akses" }, { status: 403 });
  try {
    const [orders, successful, pending, failed, total] = await Promise.all([
      prisma.paymentOrder.findMany({
        orderBy: { createdAt: "desc" },
        take: 500,
        include: { service: { select: { name: true } } },
      }),
      prisma.paymentOrder.count({ where: { status: { in: successfulStatuses } } }),
      prisma.paymentOrder.count({ where: { status: "PENDING" } }),
      prisma.paymentOrder.count({ where: { status: { in: failedStatuses } } }),
      prisma.paymentOrder.aggregate({ where: { status: { in: successfulStatuses } }, _sum: { grossAmount: true } }),
    ]);

    return Response.json({
      summary: { successful, pending, failed, successfulAmount: total._sum.grossAmount || 0, total: orders.length },
      transactions: orders.map(serializeOrder),
    });
  } catch (error) {
    console.error("Failed to list payments", error);
    return Response.json({ error: "Gagal mengambil data transaksi." }, { status: 500 });
  }
}
