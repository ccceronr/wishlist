import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">
          Hola, {session.user.nickname} 👋
        </h1>
        <p className="text-muted-foreground">
          Dashboard en construcción — Fase 4
        </p>
      </div>
    </main>
  );
}
