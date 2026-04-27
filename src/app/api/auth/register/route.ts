import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  nickname: z
    .string()
    .min(3, "Mínimo 3 caracteres")
    .max(30, "Máximo 30 caracteres")
    .regex(/^[a-zA-Z0-9_]+$/, "Solo letras, números y guión bajo"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, nickname, password } = parsed.data;

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { nickname }] },
    });

    if (existing) {
      const field = existing.email === email ? "email" : "nickname";
      return NextResponse.json(
        { error: { [field]: [`Este ${field} ya está en uso`] } },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { email, nickname, passwordHash },
    });

    return NextResponse.json(
      { id: user.id, email: user.email, nickname: user.nickname },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
