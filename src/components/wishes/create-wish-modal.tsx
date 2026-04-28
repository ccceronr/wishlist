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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "./image-upload";
import { useWishStore } from "@/stores/wish-store";
import type { Tag } from "@/types/wish";

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
};

export function CreateWishModal({ open, onOpenChange }: Props) {
  const { addWish, tags, setTags, addTag } = useWishStore();
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [creatingTag, setCreatingTag] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      isPriority: false,
      urls: [],
      images: [],
    },
  });

  const { fields: urlFields, append: appendUrl, remove: removeUrl } =
    useFieldArray({ control, name: "urls" });

  const images = watch("images");

  useEffect(() => {
    if (!open || tags.length > 0) return;
    fetch("/api/tags")
      .then((r) => r.json())
      .then((data) => setTags(data))
      .catch(console.error);
  }, [open, tags.length, setTags]);

  const handleClose = () => {
    reset();
    setSelectedTagIds([]);
    setNewTagName("");
    setError(null);
    onOpenChange(false);
  };

  const toggleTag = (id: string) => {
    setSelectedTagIds((prev) => {
      if (prev.includes(id)) return prev.filter((t) => t !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  };

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
    } catch {
      // silently ignore
    } finally {
      setCreatingTag(false);
    }
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

      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(
          typeof json.error === "string" ? json.error : "Error al crear el deseo"
        );
        return;
      }

      addWish(json);
      handleClose();
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Nuevo deseo</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <ScrollArea className="max-h-[65vh] pr-4">
            <div className="space-y-4 py-1">
              <div className="space-y-1.5">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  placeholder="¿Qué deseas?"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-xs text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Detalles del deseo..."
                  rows={3}
                  {...register("description")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="price">Precio estimado</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    $
                  </span>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-7"
                    {...register("price")}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPriority"
                  className="w-4 h-4 accent-primary"
                  {...register("isPriority")}
                />
                <Label htmlFor="isPriority" className="cursor-pointer">
                  Marcar como prioritario
                </Label>
              </div>

              <Separator />

              <div className="space-y-1.5">
                <Label>
                  URLs{" "}
                  <span className="text-muted-foreground text-xs">(máx 3)</span>
                </Label>
                <div className="space-y-2">
                  {urlFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <Input
                        placeholder="https://..."
                        {...register(`urls.${index}.value`)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeUrl(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {urlFields.length < 3 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => appendUrl({ value: "" })}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Agregar URL
                    </Button>
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>
                  Etiquetas{" "}
                  <span className="text-muted-foreground text-xs">
                    ({selectedTagIds.length}/4)
                  </span>
                </Label>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => {
                    const selected = selectedTagIds.includes(tag.id);
                    return (
                      <Badge
                        key={tag.id}
                        variant={selected ? "default" : "outline"}
                        className="cursor-pointer select-none"
                        onClick={() => toggleTag(tag.id)}
                      >
                        {tag.name}
                      </Badge>
                    );
                  })}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Nueva etiqueta..."
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        createTag();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={createTag}
                    disabled={creatingTag || !newTagName.trim()}
                  >
                    {creatingTag ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Crear"
                    )}
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-1.5">
                <Label>
                  Imágenes{" "}
                  <span className="text-muted-foreground text-xs">(máx 3)</span>
                </Label>
                <ImageUpload
                  value={images}
                  onChange={(urls) => setValue("images", urls)}
                />
              </div>
            </div>
          </ScrollArea>

          {error && (
            <p className="text-sm text-destructive mt-3">{error}</p>
          )}

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar deseo"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
