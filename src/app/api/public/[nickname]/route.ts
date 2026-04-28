import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ nickname: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { nickname } = await params;

  const user = await prisma.user.findUnique({
    where: { nickname },
    select: { id: true, nickname: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  const wishes = await prisma.wish.findMany({
    where: { userId: user.id, isFulfilled: false },
    include: { tags: { include: { tag: true } } },
    orderBy: [{ isPriority: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ user: { nickname: user.nickname }, wishes });
}
