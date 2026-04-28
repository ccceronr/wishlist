import { z } from "zod";

export const wishSchema = z.object({
  title: z.string().min(1, "El título es requerido").max(100),
  description: z.string().max(500).optional().nullable(),
  price: z.number().positive("El precio debe ser positivo").optional().nullable(),
  isPriority: z.boolean().default(false),
  urls: z
    .array(z.string().url("URL inválida"))
    .max(3, "Máximo 3 URLs"),
  images: z.array(z.string()).max(3, "Máximo 3 imágenes"),
  tagIds: z.array(z.string()).max(4, "Máximo 4 etiquetas"),
});

export type WishInput = z.infer<typeof wishSchema>;
