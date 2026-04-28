import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const tagSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(30, "Máximo 30 caracteres"),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const tags = await prisma.tag.findMany({
    where: {
      OR: [{ isDefault: true }, { userId: session.user.id }],
    },
    orderBy: [{ isDefault: "desc" }, { name: "asc" }],
  });

  return NextResponse.json(tags);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = tagSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const tag = await prisma.tag.create({
    data: {
      name: parsed.data.name.toLowerCase(),
      isDefault: false,
      userId: session.user.id,
    },
  });

  return NextResponse.json(tag, { status: 201 });
}
