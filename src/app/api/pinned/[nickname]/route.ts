import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ nickname: string }> };

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { nickname } = await params;
  const target = await prisma.user.findUnique({
    where: { nickname },
    select: { id: true },
  });
  if (!target) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  await prisma.pinnedWishlist.deleteMany({
    where: { userId: session.user.id, pinnedUserId: target.id },
  });

  return new NextResponse(null, { status: 204 });
}
