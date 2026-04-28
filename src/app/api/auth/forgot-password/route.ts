import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email requerido" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });

  // Siempre responder OK para no revelar si el email existe
  if (!user) return NextResponse.json({ ok: true });

  // Invalidar tokens anteriores del usuario
  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

  await prisma.passwordResetToken.create({
    data: { token, userId: user.id, expiresAt },
  });

  const origin = req.headers.get("origin") ?? "";
  await sendPasswordResetEmail(email, token, origin);

  return NextResponse.json({ ok: true });
}
