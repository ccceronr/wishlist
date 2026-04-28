import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { wishSchema } from "@/lib/validations/wish";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const wishes = await prisma.wish.findMany({
    where: { userId: session.user.id },
    include: { tags: { include: { tag: true } } },
    orderBy: [{ isPriority: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(wishes);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
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

  if (data.isPriority) {
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

  const wish = await prisma.wish.create({
    data: {
      ...data,
      userId: session.user.id,
      tags: { create: tagIds.map((tagId) => ({ tagId })) },
    },
    include: { tags: { include: { tag: true } } },
  });

  return NextResponse.json(wish, { status: 201 });
}
