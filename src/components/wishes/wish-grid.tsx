"use client";

import { useState } from "react";
import { CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { WishCard } from "./wish-card";
import { WishDetailModal } from "./wish-detail-modal";
import { FilterBar } from "./filter-bar";
import { Button } from "@/components/ui/button";
import { useWishStore } from "@/stores/wish-store";
import type { Wish } from "@/types/wish";
import type { DateRange } from "./filter-bar";

export function WishGrid() {
  const { wishes } = useWishStore();
  const [selectedWish, setSelectedWish] = useState<Wish | null>(null);
  const [showFulfilled, setShowFulfilled] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [priorityOnly, setPriorityOnly] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>("all");

  const active = wishes.filter((w) => !w.isFulfilled);
  const fulfilled = wishes.filter((w) => w.isFulfilled);

  const hasFilters = !!search.trim() || selectedTagIds.length > 0 || priorityOnly || dateRange !== "all";

  const applyFilters = (list: Wish[]) =>
    list.filter((wish) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        if (
          !wish.title.toLowerCase().includes(q) &&
          !(wish.description?.toLowerCase().includes(q))
        ) return false;
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

  const filteredActive = applyFilters(active);

  const toggleTag = (id: string) =>
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );

  const clearFilters = () => {
    setSearch("");
    setSelectedTagIds([]);
    setPriorityOnly(false);
    setDateRange("all");
  };

  return (
    <>
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        selectedTagIds={selectedTagIds}
        onTagToggle={toggleTag}
        priorityOnly={priorityOnly}
        onPriorityToggle={() => setPriorityOnly((v) => !v)}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onClear={clearFilters}
        hasFilters={hasFilters}
      />

      {/* Active wishes */}
      {filteredActive.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
          <span className="text-5xl mb-4">{hasFilters ? "🔍" : "✨"}</span>
          <p className="font-medium">
            {hasFilters ? "No hay deseos que coincidan" : "Aún no tienes deseos"}
          </p>
          <p className="text-sm">
            {hasFilters
              ? "Prueba con otros filtros o limpia la búsqueda"
              : 'Haz click en "Nuevo deseo" para comenzar'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredActive.map((wish) => (
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
