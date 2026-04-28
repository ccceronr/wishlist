import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { wishSchema } from "@/lib/validations/wish";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.wish.findUnique({ where: { id } });

  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = wishSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { tagIds, ...data } = parsed.data;

  if (data.isPriority && !existing.isPriority) {
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
    data: {
      ...data,
      tags: {
        deleteMany: {},
        create: tagIds.map((tagId) => ({ tagId })),
      },
    },
    include: { tags: { include: { tag: true } } },
  });

  return NextResponse.json(wish);
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.wish.findUnique({ where: { id } });

  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  await prisma.wish.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
