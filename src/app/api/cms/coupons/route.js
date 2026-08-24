import {
  createCouponController,
  deleteCouponController,
  listCouponsController,
  updateCouponController,
} from "@/lib/coupons/couponController";

export async function GET() {
  return listCouponsController();
}

export async function POST(request) {
  return createCouponController(request);
}

export async function PATCH(request) {
  return updateCouponController(request);
}

export async function DELETE(request) {
  return deleteCouponController(request);
}
