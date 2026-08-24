import { prisma } from "@/lib/prisma";
import { findUsableCoupon } from "@/lib/coupons/couponController";
import { z } from "zod";

const checkoutSchema = z.object({
  serviceId: z.string().cuid(),
  customer: z.object({
    name: z.string().trim().min(2).max(120),
    email: z.string().email().max(160),
    phone: z.string().trim().min(8).max(30),
  }),
  couponCode: z.string().trim().max(40).optional().default(""),
  paymentMethod: z.enum(["qris", "bca_va", "bni_va", "bri_va", "mandiri_va", "cimb_va", "gopay", "shopeepay"]).default("qris"),
});

export async function GET(request) {
  const orderId = new URL(request.url).searchParams.get("orderId");
  if (!orderId) return Response.json({ error: "Order ID wajib diisi." }, { status: 400 });

  const order = await prisma.paymentOrder.findUnique({
    where: { orderId },
    select: { orderId: true, status: true, paidAt: true },
  });
  if (!order) return Response.json({ error: "Transaksi tidak ditemukan." }, { status: 404 });
  return Response.json({ order });
}

function parsePrice(value) {
  const amount = Number(String(value).replace(/[^0-9]/g, ""));
  return Number.isSafeInteger(amount) && amount > 0 ? amount : null;
}

export async function POST(request) {
  try {
    const result = checkoutSchema.safeParse(await request.json());
    if (!result.success) return Response.json({ error: "Data pembelian belum lengkap." }, { status: 400 });

    const service = await prisma.service.findFirst({
      where: { id: result.data.serviceId, category: { isPublished: true }, },
      select: { id: true, name: true, price: true, duration: true, description: true, benefits: true },
    });
    if (!service) return Response.json({ error: "Layanan tidak ditemukan." }, { status: 404 });

    const grossAmount = parsePrice(service.price);
    if (!grossAmount) return Response.json({ error: "Harga layanan belum valid." }, { status: 400 });

    let coupon;
    let discountAmount = 0;
    try {
      ({ coupon, discountAmount } = await findUsableCoupon(result.data.couponCode, grossAmount));
    } catch (couponError) {
      return Response.json({ error: couponError.message }, { status: 400 });
    }
    const payableAmount = grossAmount - discountAmount;
    if (payableAmount < 1) return Response.json({ error: "Nominal pembayaran tidak valid setelah diskon." }, { status: 400 });

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (!serverKey) return Response.json({ error: "Pembayaran online belum tersedia. Silakan hubungi kami untuk pemesanan." }, { status: 503 });

    const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
    const endpoint = isProduction ? "https://api.midtrans.com/v2/charge" : "https://api.sandbox.midtrans.com/v2/charge";
    const orderId = `SEBISA-${service.id.slice(-8).toUpperCase()}-${Date.now()}`;
    await prisma.$transaction(async (transaction) => {
      await transaction.paymentOrder.create({
        data: {
          orderId,
          serviceId: service.id,
          customerName: result.data.customer.name,
          customerEmail: result.data.customer.email,
          customerPhone: result.data.customer.phone,
          grossAmount: payableAmount,
          couponId: coupon?.id,
          couponCode: coupon?.code,
          discountAmount,
        },
      });
    });
    const paymentMethod = result.data.paymentMethod;
    const paymentPayload = {
      transaction_details: { order_id: orderId, gross_amount: payableAmount },
      customer_details: { first_name: result.data.customer.name, email: result.data.customer.email, phone: result.data.customer.phone },
      ...(paymentMethod === "qris" ? { payment_type: "qris", qris: { acquirer: "gopay" } } : {}),
      ...(paymentMethod.endsWith("_va") ? { payment_type: "bank_transfer", bank_transfer: { bank: paymentMethod.replace("_va", "") } } : {}),
      ...(paymentMethod === "gopay" ? { payment_type: "gopay", gopay: { enable_callback: true, callback_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3002"}/?payment=success` } } : {}),
      ...(paymentMethod === "shopeepay" ? { payment_type: "shopeepay", shopeepay: { callback_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3002"}/?payment=success` } } : {}),
    };
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`,
      },
      body: JSON.stringify(paymentPayload),
    });
    const payment = await response.json();
    if (!response.ok || String(payment.status_code) !== "201") {
      console.error("Midtrans checkout failed", payment);
      await prisma.paymentOrder.update({ where: { orderId }, data: { status: "UNKNOWN", rawNotification: payment } });
      return Response.json({ error: "Checkout belum dapat dibuat." }, { status: 502 });
    }
    await prisma.paymentOrder.update({
      where: { orderId },
      data: { paymentType: payment.payment_type, rawNotification: payment },
    });
    if (coupon) {
      await prisma.coupon.update({ where: { id: coupon.id }, data: { usedCount: { increment: 1 } } });
    }

    return Response.json({
      orderId,
      payment: {
        method: paymentMethod,
        status: payment.transaction_status,
        vaNumbers: payment.va_numbers || [],
        actions: payment.actions || [],
        expiryTime: payment.expiry_time || null,
      },
      summary: {
        serviceName: service.name,
        duration: service.duration || "Sesuai kebutuhan",
        benefits: (service.benefits?.length ? service.benefits : service.description.split(",")).map((benefit) => String(benefit).trim()).filter(Boolean),
        customerName: result.data.customer.name,
        customerEmail: result.data.customer.email,
        customerPhone: result.data.customer.phone,
        originalAmount: grossAmount,
        discountAmount,
        totalAmount: payableAmount,
        couponCode: coupon?.code || null,
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Failed to create Midtrans checkout", error);
    return Response.json({ error: "Pembayaran belum dapat diproses." }, { status: 500 });
  }
}
