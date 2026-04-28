"use client";

import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Wish } from "@/types/wish";

type Props = {
  wish: Wish;
  onClick: () => void;
};

function WishPlaceholder() {
  return (
    <div className="w-full h-40 flex items-center justify-center bg-gradient-to-br from-violet-100 to-pink-100 dark:from-violet-950 dark:to-pink-950">
      <span className="text-4xl">✨</span>
    </div>
  );
}

export function WishCard({ wish, onClick }: Props) {
  const firstImage = wish.images[0];

  return (
    <div
      onClick={onClick}
      className="group relative rounded-xl border bg-card overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* Priority badge */}
      {wish.isPriority && (
        <div className="absolute top-2 left-2 z-10">
          <Badge className="bg-amber-500 hover:bg-amber-500 text-white gap-1 px-2 py-0.5 text-xs">
            <Star className="w-3 h-3 fill-white" /> Prioritario
          </Badge>
        </div>
      )}

      {/* Image */}
      {firstImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={firstImage}
          alt={wish.title}
          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <WishPlaceholder />
      )}

      {/* Content */}
      <div className="p-3 space-y-2">
        <h3 className="font-semibold text-sm leading-tight line-clamp-2">{wish.title}</h3>

        {wish.price != null && (
          <p className="text-sm font-medium text-primary">
            ${wish.price.toLocaleString("es")}
          </p>
        )}

        {wish.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {wish.tags.slice(0, 3).map(({ tag }) => (
              <Badge key={tag.id} variant="secondary" className="text-xs px-1.5 py-0">
                {tag.name}
              </Badge>
            ))}
            {wish.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs px-1.5 py-0">
                +{wish.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
