import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import { Star, Share2, CheckCircle2, Tag, Image, Sparkles } from "lucide-react";

const features = [
  {
    icon: Star,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    title: "Prioriza lo que más quieres",
    desc: "Marca hasta 5 deseos como prioritarios y siempre los verás primero. Nunca pierdas de vista lo que de verdad importa.",
  },
  {
    icon: Share2,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    title: "Comparte tu wishlist",
    desc: "Tu cuenta tiene una URL pública única. Compártela con amigos y familia para que sepan exactamente qué regalarte.",
  },
  {
    icon: Tag,
    color: "text-fuchsia-500",
    bg: "bg-fuchsia-500/10",
    title: "Organiza con etiquetas",
    desc: "Categoriza tus deseos con etiquetas personalizadas y filtra tu lista para encontrar lo que buscas en segundos.",
  },
  {
    icon: Image,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    title: "Imágenes y links",
    desc: "Agrega hasta 3 fotos y los links de dónde comprarlo. Todo lo que necesitas para que no haya excusas.",
  },
  {
    icon: CheckCircle2,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    title: "Celebra lo cumplido",
    desc: "Cuando lo consigas, márcalo como cumplido. Tu historial de logros siempre ahí para recordarte lo bien que te va.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Logo size="lg" />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className={cn(buttonVariants({ size: "sm" }))}
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden flex flex-col items-center justify-center text-center px-4 py-24 sm:py-36">
        {/* Background blobs */}
        <div className="pointer-events-none absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-rose-300/30 blur-3xl dark:bg-rose-500/15" />
        <div className="pointer-events-none absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-purple-300/30 blur-3xl dark:bg-fuchsia-500/15" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-pink-200/20 blur-3xl dark:bg-pink-500/10" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-1.5 text-sm text-muted-foreground mb-8 shadow-sm backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            Tu lista de deseos personal
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 max-w-3xl leading-[1.1] bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-500 bg-clip-text text-transparent">
            Todo lo que quieres,<br className="hidden sm:block" /> en un solo lugar
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed">
            Guarda tus deseos con imágenes, precios y links. Organízalos,
            priorízalos y comparte tu wishlist con quien quieras.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/register"
              className={cn(
                buttonVariants({ size: "lg" }),
                "px-8 text-base h-11 shadow-lg shadow-rose-500/25"
              )}
            >
              Crear mi wishlist gratis
            </Link>
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "text-base h-11")}
            >
              Ya tengo cuenta →
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24 w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Todo lo que necesitas</h2>
          <p className="text-muted-foreground">Simple pero completo. Sin complicaciones.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, color, bg, title, desc }) => (
            <div
              key={title}
              className="rounded-xl border bg-card p-6 space-y-3 hover:shadow-md transition-shadow"
            >
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", bg)}>
                <Icon className={cn("w-5 h-5", color)} />
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t bg-muted/30">
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            ¿Listo para empezar?
          </h2>
          <p className="text-muted-foreground mb-8">
            Es gratis. Solo necesitas tu email y un apodo único.
          </p>
          <Link
            href="/register"
            className={cn(
              buttonVariants({ size: "lg" }),
              "px-10 text-base h-11 shadow-lg shadow-rose-500/25"
            )}
          >
            Crear mi wishlist ✨
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Logo size="sm" /> <span>— Tu lista de deseos personal</span>
      </footer>
    </div>
  );
}
