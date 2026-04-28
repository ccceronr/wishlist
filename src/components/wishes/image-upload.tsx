"use client";

import { useRef, useState } from "react";
import { X, ImagePlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
const MAX_IMAGES = 3;

type Props = {
  value: string[];
  onChange: (urls: string[]) => void;
};

export function ImageUpload({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );

    if (!res.ok) throw new Error("Error al subir imagen");
    const data = await res.json();
    return data.secure_url as string;
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const available = MAX_IMAGES - value.length;
    if (available <= 0) return;

    const selected = Array.from(files).slice(0, available);
    setUploading(true);
    try {
      const urls = await Promise.all(selected.map(uploadFile));
      onChange([...value, ...urls]);
    } catch {
      alert("Error al subir una o más imágenes");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = (url: string) => onChange(value.filter((u) => u !== url));

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {value.map((url) => (
          <div key={url} className="relative w-20 h-20 rounded-md overflow-hidden border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => remove(url)}
              className="absolute top-0.5 right-0.5 bg-black/60 rounded-full p-0.5 text-white hover:bg-black/80"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {value.length < MAX_IMAGES && (
          <Button
            type="button"
            variant="outline"
            className="w-20 h-20 flex flex-col gap-1"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <ImagePlus className="w-5 h-5" />
                <span className="text-xs">Subir</span>
              </>
            )}
          </Button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <p className="text-xs text-muted-foreground">
        {value.length}/{MAX_IMAGES} imágenes
      </p>
    </div>
  );
}
