"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { LogOut, LayoutDashboard } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { FilterBar } from "@/components/wishes/filter-bar";
import { WishCard } from "@/components/wishes/wish-card";
import { WishDetailModal } from "@/components/wishes/wish-detail-modal";
import type { Wish, Tag } from "@/types/wish";
import type { DateRange } from "@/components/wishes/filter-bar";

export default function PublicWishlistPage() {
  const { nickname } = useParams<{ nickname: string }>();
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedWish, setSelectedWish] = useState<Wish | null>(null);

  const [search, setSearch] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [priorityOnly, setPriorityOnly] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>("all");

  useEffect(() => {
    fetch(`/api/public/${nickname}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); return null; }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        setWishes(data.wishes);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [nickname]);

  const availableTags: Tag[] = Array.from(
    new Map(
      wishes.flatMap((w) => w.tags.map((t) => t.tag)).map((t) => [t.id, t])
    ).values()
  );

  const hasFilters = !!search.trim() || selectedTagIds.length > 0 || priorityOnly || dateRange !== "all";

  const filtered = wishes.filter((wish) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!wish.title.toLowerCase().includes(q) && !(wish.description?.toLowerCase().includes(q)))
        return false;
    }
    if (priorityOnly && !wish.isPriority) return false;
    if (selectedTagIds.length > 0) {
      const wishTagIds = wish.tags.map((t) => t.tag.id);
      if (!selectedTagIds.some((id) => wishTagIds.includes(id))) return false;
    }
    if (dateRange !== "all") {
      const days = { week: 7, month: 30, "3months": 90 }[dateRange];
      const cutoff = new Date(Date.now() - days * 86400000);
      if (new Date(wish.createdAt) < cutoff) return false;
    }
    return true;
  });

  const { data: session } = useSession();
  const initials = nickname?.slice(0, 2).toUpperCase() ?? "";

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-background">
        <span className="text-5xl mb-4">🔍</span>
        <h1 className="text-2xl font-bold mb-2">Usuario no encontrado</h1>
        <p className="text-muted-foreground mb-6">No existe ninguna wishlist para @{nickname}</p>
        <Link href="/" className="text-primary hover:underline text-sm">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-bold tracking-tight text-muted-foreground hover:text-foreground transition-colors"
          >
            ✨ Wishlist
          </Link>
          <div className="flex items-center gap-1">
            {session && (
              <>
                <Link
                  href="/dashboard"
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                >
                  <LayoutDashboard className="w-4 h-4 mr-1.5" />
                  Mi dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-muted-foreground")}
                >
                  <LogOut className="w-4 h-4 mr-1.5" />
                  Cerrar sesión
                </button>
              </>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
        {/* User info */}
        {loading ? (
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-muted animate-pulse shrink-0" />
            <div className="space-y-2">
              <div className="h-5 w-32 bg-muted animate-pulse rounded" />
              <div className="h-4 w-48 bg-muted animate-pulse rounded" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 shrink-0">
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-bold">@{nickname}</h1>
              <p className="text-sm text-muted-foreground">
                {wishes.length === 0
                  ? "Esta wishlist está vacía por ahora"
                  : `${wishes.length} ${wishes.length === 1 ? "deseo" : "deseos"} en su wishlist`}
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        {!loading && wishes.length > 0 && (
          <FilterBar
            tags={availableTags}
            search={search}
            onSearchChange={setSearch}
            selectedTagIds={selectedTagIds}
            onTagToggle={(id) =>
              setSelectedTagIds((prev) =>
                prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
              )
            }
            priorityOnly={priorityOnly}
            onPriorityToggle={() => setPriorityOnly((v) => !v)}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            onClear={() => {
              setSearch("");
              setSelectedTagIds([]);
              setPriorityOnly(false);
              setDateRange("all");
            }}
            hasFilters={hasFilters}
          />
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border bg-muted animate-pulse h-52" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
            <span className="text-5xl mb-4">{hasFilters ? "🔍" : "✨"}</span>
            <p className="font-medium">
              {hasFilters ? "No hay deseos que coincidan" : "Esta wishlist está vacía por ahora"}
            </p>
            {hasFilters && (
              <p className="text-sm mt-1">Prueba con otros filtros</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((wish) => (
              <WishCard key={wish.id} wish={wish} onClick={() => setSelectedWish(wish)} />
            ))}
          </div>
        )}
      </main>

      <WishDetailModal wish={selectedWish} onClose={() => setSelectedWish(null)} readonly />
    </div>
  );
}
