import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { registerSchema } from "@/lib/auth/validation";

export async function registerController(request) {
  try {
    const session = await auth();
    if (session?.user?.role !== "SUPER_ADMIN") {
      return Response.json({ error: "Hanya SUPER_ADMIN yang dapat mendaftarkan akun" }, { status: 403 });
    }

    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        { error: "Nama, email, atau password tidak valid" },
        { status: 400 },
      );
    }

    const { name, email, password } = result.data;
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return Response.json({ error: "Email sudah terdaftar" }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: await hashPassword(password),
        role: "ADMIN",
        status: "ACTIVE",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });

    return Response.json({ user }, { status: 201 });
  } catch {
    return Response.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
