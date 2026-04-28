"use client";

import { useState } from "react";
import { Star, Pencil, CheckCircle, Trash2, ExternalLink, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { WishFormModal } from "./wish-form-modal";
import { useWishStore } from "@/stores/wish-store";
import type { Wish } from "@/types/wish";

type Props = {
  wish: Wish | null;
  onClose: () => void;
  readonly?: boolean;
};

export function WishDetailModal({ wish, onClose, readonly = false }: Props) {
  const { updateWish, removeWish } = useWishStore();
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState<"priority" | "fulfill" | "delete" | null>(null);

  if (!wish) return null;

  const handlePriority = async () => {
    setLoading("priority");
    try {
      const res = await fetch(`/api/wishes/${wish.id}/priority`, { method: "PATCH" });
      if (res.ok) updateWish(await res.json());
    } finally { setLoading(null); }
  };

  const handleFulfill = async () => {
    setLoading("fulfill");
    try {
      const res = await fetch(`/api/wishes/${wish.id}/fulfill`, { method: "PATCH" });
      if (res.ok) { updateWish(await res.json()); onClose(); }
    } finally { setLoading(null); }
  };

  const handleDelete = async () => {
    if (!confirm("¿Eliminar este deseo?")) return;
    setLoading("delete");
    try {
      const res = await fetch(`/api/wishes/${wish.id}`, { method: "DELETE" });
      if (res.ok) { removeWish(wish.id); onClose(); }
    } finally { setLoading(null); }
  };

  return (
    <>
      <Dialog open={!!wish} onOpenChange={onClose}>
        <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-lg max-h-[90vh] overflow-hidden p-0 gap-0">
          {/* Image hero or gradient header */}
          {wish.images.length > 0 ? (
            <div className="relative">
              <div className="grid grid-cols-3 gap-1">
                {wish.images.map((url, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={url}
                    alt={`imagen ${i + 1}`}
                    className={`w-full object-cover ${wish.images.length === 1 ? "col-span-3 h-52 rounded-t-2xl" : "h-32 first:rounded-tl-2xl last:rounded-tr-2xl"}`}
                  />
                ))}
              </div>
              {wish.isPriority && (
                <div className="absolute top-3 left-3">
                  <Badge className="bg-amber-500 text-white gap-1 shadow-md">
                    <Star className="w-3 h-3 fill-white" /> Prioritario
                  </Badge>
                </div>
              )}
            </div>
          ) : (
            <div className="relative h-20 bg-gradient-to-r from-primary/10 via-background to-accent/10 border-b rounded-t-2xl">
              {wish.isPriority && (
                <div className="absolute top-3 left-6">
                  <Badge className="bg-amber-500 text-white gap-1">
                    <Star className="w-3 h-3 fill-white" /> Prioritario
                  </Badge>
                </div>
              )}
            </div>
          )}

          <div className="overflow-y-auto">
            <div className="px-6 pt-4 pb-2">
              <DialogHeader>
                <DialogTitle className="text-xl leading-snug pr-6">{wish.title}</DialogTitle>
              </DialogHeader>
            </div>

            <div className="px-6 pb-4 space-y-4">
              {wish.price != null && (
                <p className="text-2xl font-bold text-primary">
                  ${wish.price.toLocaleString("es")}
                </p>
              )}

              {wish.description && (
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{wish.description}</p>
              )}

              {wish.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {wish.tags.map(({ tag }) => (
                    <Badge key={tag.id} variant="secondary" className="rounded-full px-3">{tag.name}</Badge>
                  ))}
                </div>
              )}

              {wish.urls.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Links</p>
                  <div className="space-y-1">
                    {wish.urls.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary hover:underline truncate p-2 rounded-lg hover:bg-primary/5 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        {url}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                Agregado el {new Date(wish.createdAt).toLocaleDateString("es", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>

            {/* Actions */}
            {!readonly && (
              <>
                <Separator />
                <div className="px-6 py-4 flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditOpen(true)} className="gap-1.5">
                    <Pencil className="w-3.5 h-3.5" /> Editar
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePriority}
                    disabled={!!loading}
                    className={`gap-1.5 ${wish.isPriority ? "text-amber-500 border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30" : ""}`}
                  >
                    {loading === "priority" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : (
                      <><Star className={`w-3.5 h-3.5 ${wish.isPriority ? "fill-amber-500" : ""}`} />
                        {wish.isPriority ? "Quitar prioridad" : "Priorizar"}</>
                    )}
                  </Button>

                  {!wish.isFulfilled && (
                    <Button variant="outline" size="sm" onClick={handleFulfill} disabled={!!loading}
                      className="gap-1.5 text-green-600 border-green-300 hover:bg-green-50 dark:hover:bg-green-950/30">
                      {loading === "fulfill" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : (
                        <><CheckCircle className="w-3.5 h-3.5" /> Cumplido</>
                      )}
                    </Button>
                  )}

                  <Button variant="ghost" size="sm" onClick={handleDelete} disabled={!!loading}
                    className="gap-1.5 text-destructive hover:bg-destructive/10 ml-auto">
                    {loading === "delete" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : (
                      <><Trash2 className="w-3.5 h-3.5" /> Eliminar</>
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <WishFormModal open={editOpen} onOpenChange={setEditOpen} wish={wish} />
    </>
  );
}
