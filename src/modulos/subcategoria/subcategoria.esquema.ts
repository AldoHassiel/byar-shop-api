import z from "zod";

export const esquemaSubcategoria = z.object({
  id_categoria: z.number(),
  nombre: z
    .string()
    .min(3, "El nombre debe de tener mínimo 3 caracteres")
    .max(100, "El nombre debe de tener máximo 100 caracteres"),
  descripcion: z
    .string()
    .min(3, "El nombre debe de tener mínimo 3 caracteres")
    .max(100, "El nombre debe de tener máximo 255 caracteres")
    .optional(),
});

export type SubcategoriaDTO = z.infer<typeof esquemaSubcategoria>;
