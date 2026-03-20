import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import z from "zod";

extendZodWithOpenApi(z);

export const esquemaSubcategoria = z
  .object({
    id_categoria: z
      .number()
      .describe(
        "ID de la categoría padre a la que pertenece esta subcategoría",
      ),
    nombre: z
      .string()
      .min(3, "El nombre debe de tener mínimo 3 caracteres")
      .max(100, "El nombre debe de tener máximo 100 caracteres")
      .describe("Nombre de la subcategoría. Entre 3 y 100 caracteres"),
    descripcion: z
      .string()
      .max(100, "El nombre debe de tener máximo 255 caracteres")
      .optional()
      .describe(
        "Descripción breve de la subcategoría (opcional). Máximo 100 caracteres",
      ),
  })
  .openapi("Subcategoria");

export type SubcategoriaDTO = z.infer<typeof esquemaSubcategoria>;
