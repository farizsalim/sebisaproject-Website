import { loginController } from "@/lib/auth/controllers/loginController";

export async function POST(request) {
  return loginController(request);
}
