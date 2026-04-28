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

  if (!existing.isPriority) {
    const priorityCount = await prisma.wish.count({
      where: { userId: session.user.id, isPriority: true, isFulfilled: false },
    });
    if (priorityCount >= 5) {
      return NextResponse.json(
        { error: "Máximo 5 deseos prioritarios simultáneos" },
        { status: 400 }
      );
    }
  }

  const wish = await prisma.wish.update({
    where: { id },
    data: { isPriority: !existing.isPriority },
    include: { tags: { include: { tag: true } } },
  });

  return NextResponse.json(wish);
}
