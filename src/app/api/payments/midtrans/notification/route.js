import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";

const validStatuses = new Set(["PENDING", "SETTLEMENT", "CAPTURE", "DENY", "CANCEL", "EXPIRE", "REFUND"]);

function mapPaymentStatus(transactionStatus, fraudStatus) {
  if (transactionStatus === "capture" && fraudStatus === "challenge") return "PENDING";
  const normalized = String(transactionStatus || "").toUpperCase();
  return validStatuses.has(normalized) ? normalized : "UNKNOWN";
}

function isValidSignature(notification) {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) return false;
  const payload = `${notification.order_id}${notification.status_code}${notification.gross_amount}${serverKey}`;
  const expected = crypto.createHash("sha512").update(payload).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(String(notification.signature_key || "")));
}

export async function POST(request) {
  try {
    const notification = await request.json();
    if (!notification?.order_id || !isValidSignature(notification)) {
      return Response.json({ error: "Signature notification tidak valid." }, { status: 401 });
    }

    const status = mapPaymentStatus(notification.transaction_status, notification.fraud_status);
    const paidAt = ["SETTLEMENT", "CAPTURE"].includes(status) ? new Date() : undefined;
    await prisma.paymentOrder.update({
      where: { orderId: notification.order_id },
      data: {
        status,
        transactionId: notification.transaction_id || null,
        paymentType: notification.payment_type || null,
        fraudStatus: notification.fraud_status || null,
        rawNotification: notification,
        ...(paidAt ? { paidAt } : {}),
      },
    });

    return Response.json({ received: true });
  } catch (error) {
    console.error("Failed to process Midtrans notification", error);
    return Response.json({ error: "Notification belum dapat diproses." }, { status: 500 });
  }
}