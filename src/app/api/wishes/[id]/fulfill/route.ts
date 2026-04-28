import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.wish.findUnique({ where: { id } });

  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  const wish = await prisma.wish.update({
    where: { id },
    data: { isFulfilled: true, isPriority: false },
    include: { tags: { include: { tag: true } } },
  });

  return NextResponse.json(wish);
}
