"use client";

import { useEffect, useState } from "react";
import { Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/layout/sidebar";
import { WishGrid } from "@/components/wishes/wish-grid";
import { WishFormModal } from "@/components/wishes/wish-form-modal";
import { useWishStore } from "@/stores/wish-store";

export default function DashboardPage() {
  const { setWishes, setTags } = useWishStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/wishes").then((r) => r.json()),
      fetch("/api/tags").then((r) => r.json()),
    ])
      .then(([wishes, tags]) => { setWishes(wishes); setTags(tags); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [setWishes, setTags]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed left-0 top-0 z-50 h-full lg:hidden">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b bg-card shrink-0">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>
          <span className="font-bold text-base">✨ Wishlist</span>
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4" />
          </Button>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">Mis deseos</h2>
                <p className="text-sm text-muted-foreground">Organiza todo lo que quieres</p>
              </div>
              <Button className="hidden lg:inline-flex" onClick={() => setModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo deseo
              </Button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-xl border bg-muted animate-pulse h-52" />
                ))}
              </div>
            ) : (
              <WishGrid />
            )}
          </div>
        </main>
      </div>

      <WishFormModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
