import { listPaymentsController } from "@/lib/payments/paymentController";

export async function GET() {
  return listPaymentsController();
}
