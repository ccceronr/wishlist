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
};

export function WishDetailModal({ wish, onClose }: Props) {
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
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start gap-2 pr-6">
              {wish.isPriority && (
                <Badge className="bg-amber-500 text-white shrink-0 gap-1 mt-0.5">
                  <Star className="w-3 h-3 fill-white" /> Prioritario
                </Badge>
              )}
              <DialogTitle className="leading-snug">{wish.title}</DialogTitle>
            </div>
          </DialogHeader>

          {/* Images */}
          {wish.images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {wish.images.map((url, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={url}
                  alt={`imagen ${i + 1}`}
                  className="w-full h-28 object-cover rounded-md"
                />
              ))}
            </div>
          )}

          <div className="space-y-3">
            {wish.price != null && (
              <p className="text-lg font-semibold text-primary">
                ${wish.price.toLocaleString("es")}
              </p>
            )}

            {wish.description && (
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{wish.description}</p>
            )}

            {wish.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {wish.tags.map(({ tag }) => (
                  <Badge key={tag.id} variant="secondary">{tag.name}</Badge>
                ))}
              </div>
            )}

            {wish.urls.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Links</p>
                {wish.urls.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-primary hover:underline truncate"
                  >
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    {url}
                  </a>
                ))}
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              Creado el {new Date(wish.createdAt).toLocaleDateString("es")}
            </p>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
              <Pencil className="w-4 h-4 mr-1.5" /> Editar
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handlePriority}
              disabled={!!loading}
              className={wish.isPriority ? "text-amber-500 border-amber-300" : ""}
            >
              {loading === "priority" ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <><Star className={`w-4 h-4 mr-1.5 ${wish.isPriority ? "fill-amber-500" : ""}`} />
                  {wish.isPriority ? "Quitar prioridad" : "Priorizar"}</>
              )}
            </Button>

            {!wish.isFulfilled && (
              <Button variant="outline" size="sm" onClick={handleFulfill} disabled={!!loading}
                className="text-green-600 border-green-300 hover:bg-green-50 dark:hover:bg-green-950">
                {loading === "fulfill" ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <><CheckCircle className="w-4 h-4 mr-1.5" /> Cumplido</>
                )}
              </Button>
            )}

            <Button variant="ghost" size="sm" onClick={handleDelete} disabled={!!loading}
              className="text-destructive hover:bg-destructive/10 ml-auto">
              {loading === "delete" ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <><Trash2 className="w-4 h-4 mr-1.5" /> Eliminar</>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <WishFormModal open={editOpen} onOpenChange={setEditOpen} wish={wish} />
    </>
  );
}
