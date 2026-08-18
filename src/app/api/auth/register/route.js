import { registerController } from "@/lib/auth/controllers/registerController";

export async function POST(request) {
  return registerController(request);
}
