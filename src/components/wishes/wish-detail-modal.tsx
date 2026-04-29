"use client";

import { useState } from "react";
import { Star, Pencil, CheckCircle, Trash2, ExternalLink, Loader2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

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
    setLoading("delete");
    try {
      const res = await fetch(`/api/wishes/${wish.id}`, { method: "DELETE" });
      if (res.ok) { removeWish(wish.id); setConfirmDeleteOpen(false); onClose(); }
    } finally { setLoading(null); }
  };

  return (
    <>
      <Dialog open={!!wish} onOpenChange={onClose}>
        <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-lg max-h-[90vh] overflow-hidden p-0 gap-0">
          <div className="overflow-y-auto">
            {/* Title + priority badge */}
            <div className="px-6 pt-6 pb-3">
              {wish.isPriority && (
                <Badge className="mb-2 bg-rose-100 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 gap-1 border-0 rounded-full px-2.5 py-0.5">
                  <Star className="w-3 h-3 fill-rose-500 text-rose-500" /> Prioritario
                </Badge>
              )}
              <DialogHeader>
                <DialogTitle className="text-xl leading-snug pr-6">{wish.title}</DialogTitle>
              </DialogHeader>
            </div>

            {/* Images with padding, clickable */}
            {wish.images.length > 0 && (
              <div className="px-6 pb-3">
                <div className={`grid gap-2 ${wish.images.length === 1 ? "grid-cols-1" : "grid-cols-3"}`}>
                  {wish.images.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setExpandedImage(url)}
                      className="group relative overflow-hidden rounded-xl border border-border/40 hover:ring-2 hover:ring-primary/40 transition-all cursor-zoom-in"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`imagen ${i + 1}`}
                        className={`w-full object-cover ${wish.images.length === 1 ? "h-56" : "h-32"} group-hover:scale-105 transition-transform duration-300`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

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
                    className={`gap-1.5 ${wish.isPriority ? "text-rose-600 border-rose-200 hover:bg-rose-50 dark:text-rose-400 dark:border-rose-900/60 dark:hover:bg-rose-950/30" : ""}`}
                  >
                    {loading === "priority" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : (
                      <><Star className={`w-3.5 h-3.5 ${wish.isPriority ? "fill-rose-500 text-rose-500" : ""}`} />
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

                  <Button variant="ghost" size="sm" onClick={() => setConfirmDeleteOpen(true)} disabled={!!loading}
                    className="gap-1.5 text-destructive hover:bg-destructive/10 ml-auto">
                    <Trash2 className="w-3.5 h-3.5" /> Eliminar
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Image lightbox */}
      {expandedImage && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in-0 duration-150"
          onClick={() => setExpandedImage(null)}
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setExpandedImage(null); }}
            className="absolute top-4 right-4 text-white p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={expandedImage}
            alt="vista detallada"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-2xl cursor-default"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <WishFormModal open={editOpen} onOpenChange={setEditOpen} wish={wish} />

      {/* Confirm delete dialog */}
      <Dialog open={confirmDeleteOpen} onOpenChange={(open) => !open && loading !== "delete" && setConfirmDeleteOpen(false)}>
        <DialogContent className="sm:max-w-sm">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-destructive" />
            </div>
            <DialogHeader className="flex-1">
              <DialogTitle>¿Eliminar este deseo?</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Esta acción no se puede deshacer. <span className="font-medium text-foreground">&ldquo;{wish.title}&rdquo;</span> se eliminará permanentemente.
              </p>
            </DialogHeader>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDeleteOpen(false)}
              disabled={loading === "delete"}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading === "delete"}
              className="bg-destructive text-white hover:bg-destructive/90 gap-1.5"
            >
              {loading === "delete" ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Eliminando...</>
              ) : (
                <><Trash2 className="w-4 h-4" /> Eliminar</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
