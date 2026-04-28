"use client";

import { Search, Star, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWishStore } from "@/stores/wish-store";
import type { Tag } from "@/types/wish";

export type DateRange = "all" | "week" | "month" | "3months";

type Props = {
  tags?: Tag[];
  search: string;
  onSearchChange: (v: string) => void;
  selectedTagIds: string[];
  onTagToggle: (id: string) => void;
  priorityOnly: boolean;
  onPriorityToggle: () => void;
  dateRange: DateRange;
  onDateRangeChange: (v: DateRange) => void;
  onClear: () => void;
  hasFilters: boolean;
};

export function FilterBar({
  tags: tagsProp,
  search, onSearchChange,
  selectedTagIds, onTagToggle,
  priorityOnly, onPriorityToggle,
  dateRange, onDateRangeChange,
  onClear, hasFilters,
}: Props) {
  const { tags: storeTags } = useWishStore();
  const tags = tagsProp ?? storeTags;

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          className="pl-9"
          placeholder="Buscar por título o descripción..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Tag chips */}
        {tags.map((tag) => (
          <Badge
            key={tag.id}
            variant={selectedTagIds.includes(tag.id) ? "default" : "outline"}
            className="cursor-pointer select-none"
            onClick={() => onTagToggle(tag.id)}
          >
            {tag.name}
          </Badge>
        ))}

        {/* Priority toggle */}
        <Button
          variant={priorityOnly ? "default" : "outline"}
          size="sm"
          onClick={onPriorityToggle}
          className={priorityOnly ? "bg-amber-500 hover:bg-amber-600 border-amber-500 text-white" : ""}
        >
          <Star className={`w-3.5 h-3.5 mr-1.5 ${priorityOnly ? "fill-white" : ""}`} />
          Prioritarios
        </Button>

        {/* Date range */}
        <select
          value={dateRange}
          onChange={(e) => onDateRangeChange(e.target.value as DateRange)}
          className="h-9 cursor-pointer rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">Todo el tiempo</option>
          <option value="week">Esta semana</option>
          <option value="month">Este mes</option>
          <option value="3months">Últimos 3 meses</option>
        </select>

        {/* Clear filters */}
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground">
            <X className="w-3.5 h-3.5 mr-1" />
            Limpiar
          </Button>
        )}
      </div>
    </div>
  );
}
