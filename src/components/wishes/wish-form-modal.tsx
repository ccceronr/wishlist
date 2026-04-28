"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, X, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "./image-upload";
import { useWishStore } from "@/stores/wish-store";
import type { Tag, Wish } from "@/types/wish";

const formSchema = z.object({
  title: z.string().min(1, "El título es requerido").max(100),
  description: z.string().max(500).optional(),
  price: z.string().optional(),
  isPriority: z.boolean(),
  urls: z.array(z.object({ value: z.string() })).max(3),
  images: z.array(z.string()).max(3),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wish?: Wish;
};

export function WishFormModal({ open, onOpenChange, wish }: Props) {
  const isEditing = !!wish;
  const { addWish, updateWish, tags, setTags, addTag } = useWishStore();
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [creatingTag, setCreatingTag] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, control, setValue, watch, reset, formState: { errors } } =
    useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: { title: "", description: "", price: "", isPriority: false, urls: [], images: [] },
    });

  const { fields: urlFields, append: appendUrl, remove: removeUrl } =
    useFieldArray({ control, name: "urls" });

  const images = watch("images");

  useEffect(() => {
    if (!open || tags.length > 0) return;
    fetch("/api/tags").then((r) => r.json()).then(setTags).catch(console.error);
  }, [open, tags.length, setTags]);

  useEffect(() => {
    if (!open) return;
    if (wish) {
      reset({
        title: wish.title,
        description: wish.description ?? "",
        price: wish.price != null ? String(wish.price) : "",
        isPriority: wish.isPriority,
        urls: wish.urls.map((v) => ({ value: v })),
        images: wish.images,
      });
      setSelectedTagIds(wish.tags.map((t) => t.tag.id));
    } else {
      reset({ title: "", description: "", price: "", isPriority: false, urls: [], images: [] });
      setSelectedTagIds([]);
    }
    setError(null);
  }, [open, wish, reset]);

  const handleClose = () => { setNewTagName(""); setError(null); onOpenChange(false); };

  const toggleTag = (id: string) =>
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : prev.length >= 4 ? prev : [...prev, id]
    );

  const createTag = async () => {
    if (!newTagName.trim()) return;
    setCreatingTag(true);
    try {
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTagName.trim() }),
      });
      const tag: Tag = await res.json();
      addTag(tag);
      toggleTag(tag.id);
      setNewTagName("");
    } catch { /* silently ignore */ }
    finally { setCreatingTag(false); }
  };

  const onSubmit = async (data: FormValues) => {
    setError(null);
    setSubmitting(true);
    try {
      const payload = {
        title: data.title,
        description: data.description || null,
        price: data.price ? parseFloat(data.price) : null,
        isPriority: data.isPriority,
        urls: data.urls.map((u) => u.value).filter(Boolean),
        images: data.images,
        tagIds: selectedTagIds,
      };
      const res = await fetch(isEditing ? `/api/wishes/${wish.id}` : "/api/wishes", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        const msg = typeof json.error === "string"
          ? json.error
          : Object.values(json.error ?? {}).flat().join(", ") || "Error al guardar";
        setError(msg);
        return;
      }
      isEditing ? updateWish(json) : addWish(json);
      handleClose();
    } catch { setError("Error de conexión. Intenta de nuevo."); }
    finally { setSubmitting(false); }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-2xl max-h-[92vh] overflow-hidden p-0 gap-0">
        {/* Gradient header */}
        <div className="px-6 pt-6 pb-4 border-b bg-gradient-to-r from-primary/5 via-background to-accent/5">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {isEditing ? "Editar deseo" : "✨ Nuevo deseo"}
            </DialogTitle>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

            {/* Título */}
            <div className="space-y-1.5">
              <Label htmlFor="title" className="font-semibold">Título *</Label>
              <Input id="title" placeholder="¿Qué deseas?" className="h-10" {...register("title")} />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>

            {/* Descripción + Precio + Prioridad en grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="description" className="font-semibold">Descripción</Label>
                <Textarea id="description" placeholder="Detalles, talla, color..." rows={4} className="resize-none" {...register("description")} />
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="price" className="font-semibold">Precio estimado</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">$</span>
                    <Input id="price" type="number" min="0" step="0.01" placeholder="0.00" className="pl-7 h-10" {...register("price")} />
                  </div>
                </div>

                <label htmlFor="isPriority" className="flex items-center gap-3 p-3 rounded-xl border border-border/80 bg-muted/30 cursor-pointer hover:bg-muted/60 transition-colors">
                  <input type="checkbox" id="isPriority" className="w-4 h-4 accent-primary" {...register("isPriority")} />
                  <div>
                    <p className="text-sm font-semibold">⭐ Prioritario</p>
                    <p className="text-xs text-muted-foreground">Aparece primero en tu lista</p>
                  </div>
                </label>
              </div>
            </div>

            <Separator />

            {/* URLs */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="font-semibold">URLs</Label>
                <span className="text-xs text-muted-foreground">{urlFields.length}/3</span>
              </div>
              <div className="space-y-2">
                {urlFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <Input placeholder="https://tienda.com/producto..." className="h-9" {...register(`urls.${index}.value`)} />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeUrl(index)} className="text-muted-foreground hover:text-destructive shrink-0">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {urlFields.length < 3 && (
                  <Button type="button" variant="outline" size="sm" onClick={() => appendUrl({ value: "" })} className="w-full border-dashed">
                    <Plus className="w-4 h-4 mr-1.5" /> Agregar URL
                  </Button>
                )}
              </div>
            </div>

            <Separator />

            {/* Etiquetas */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Label className="font-semibold">Etiquetas</Label>
                <span className="text-xs text-muted-foreground">{selectedTagIds.length}/4</span>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant={selectedTagIds.includes(tag.id) ? "default" : "outline"}
                      className="cursor-pointer select-none transition-all px-3 py-1 text-xs"
                      onClick={() => toggleTag(tag.id)}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  placeholder="Nueva etiqueta..."
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); createTag(); } }}
                  className="h-9"
                />
                <Button type="button" variant="outline" size="sm" onClick={createTag} disabled={creatingTag || !newTagName.trim()} className="shrink-0">
                  {creatingTag ? <Loader2 className="w-4 h-4 animate-spin" /> : "Crear"}
                </Button>
              </div>
            </div>

            <Separator />

            {/* Imágenes */}
            <div className="space-y-2 pb-1">
              <div className="flex items-center justify-between">
                <Label className="font-semibold">Imágenes</Label>
                <span className="text-xs text-muted-foreground">{images.length}/3</span>
              </div>
              <ImageUpload value={images} onChange={(urls) => setValue("images", urls)} />
            </div>
          </div>

          {error && (
            <div className="mx-6 mb-2 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <DialogFooter className="-mx-0 -mb-0 rounded-b-2xl px-6 py-4">
            <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button type="submit" disabled={submitting} className="min-w-36">
              {submitting
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Guardando...</>
                : isEditing ? "Guardar cambios" : "Guardar deseo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
