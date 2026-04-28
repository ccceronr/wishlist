"use client";

import { useState } from "react";
import { CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { WishCard } from "./wish-card";
import { WishDetailModal } from "./wish-detail-modal";
import { Button } from "@/components/ui/button";
import { useWishStore } from "@/stores/wish-store";
import type { Wish } from "@/types/wish";

export function WishGrid() {
  const { wishes } = useWishStore();
  const [selectedWish, setSelectedWish] = useState<Wish | null>(null);
  const [showFulfilled, setShowFulfilled] = useState(false);

  const active = wishes.filter((w) => !w.isFulfilled);
  const fulfilled = wishes.filter((w) => w.isFulfilled);

  return (
    <>
      {/* Active wishes */}
      {active.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
          <span className="text-5xl mb-4">✨</span>
          <p className="font-medium">Aún no tienes deseos</p>
          <p className="text-sm">Haz click en &quot;Nuevo deseo&quot; para comenzar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {active.map((wish) => (
            <WishCard key={wish.id} wish={wish} onClick={() => setSelectedWish(wish)} />
          ))}
        </div>
      )}

      {/* Fulfilled section */}
      {fulfilled.length > 0 && (
        <div className="mt-10 space-y-4">
          <Button
            variant="ghost"
            className="gap-2 text-muted-foreground px-0"
            onClick={() => setShowFulfilled((v) => !v)}
          >
            <CheckCircle className="w-4 h-4 text-green-500" />
            Deseos cumplidos ({fulfilled.length})
            {showFulfilled ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>

          {showFulfilled && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 opacity-60">
              {fulfilled.map((wish) => (
                <WishCard key={wish.id} wish={wish} onClick={() => setSelectedWish(wish)} />
              ))}
            </div>
          )}
        </div>
      )}

      <WishDetailModal wish={selectedWish} onClose={() => setSelectedWish(null)} />
    </>
  );
}
