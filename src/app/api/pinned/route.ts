import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const pinned = await prisma.pinnedWishlist.findMany({
    where: { userId: session.user.id },
    include: { pinnedUser: { select: { nickname: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    pinned.map((p) => ({ nickname: p.pinnedUser.nickname, createdAt: p.createdAt }))
  );
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const nickname = typeof body.nickname === "string" ? body.nickname.trim() : "";
  if (!nickname) {
    return NextResponse.json({ error: "Nickname requerido" }, { status: 400 });
  }

  const target = await prisma.user.findUnique({
    where: { nickname },
    select: { id: true, nickname: true },
  });
  if (!target) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }
  if (target.id === session.user.id) {
    return NextResponse.json({ error: "No puedes anclar tu propia wishlist" }, { status: 400 });
  }

  await prisma.pinnedWishlist.upsert({
    where: { userId_pinnedUserId: { userId: session.user.id, pinnedUserId: target.id } },
    create: { userId: session.user.id, pinnedUserId: target.id },
    update: {},
  });

  return NextResponse.json({ ok: true, nickname: target.nickname });
}
