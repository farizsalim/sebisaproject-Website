import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { loginSchema } from "@/lib/auth/validation";

export async function loginController(request) {
  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return Response.json({ error: "Email dan password tidak valid" }, { status: 400 });
    }

    const { email, password } = result.data;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.status !== "ACTIVE" || !(await verifyPassword(password, user.passwordHash))) {
      return Response.json({ error: "Email atau password salah" }, { status: 401 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });

    return Response.json({ user: updatedUser });
  } catch {
    return Response.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
