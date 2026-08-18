import {
  listServicesController,
  updateServicesController,
} from "@/lib/services/serviceController";

export async function GET() {
  return listServicesController();
}

export async function PATCH(request) {
  return updateServicesController(request);
}
