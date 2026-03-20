import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import z from "zod";

extendZodWithOpenApi(z);

export const esquemaCategoria = z
  .object({
    nombre: z
      .string()
      .min(3, "El nombre debe de tener mínimo 3 caracteres")
      .max(100, "El nombre debe de tener máximo 100 caracteres")
      .describe("Nombre de la categoría. Entre 3 y 100 caracteres"),
    descripcion: z
      .string()
      .max(100, "El nombre debe de tener máximo 255 caracteres")
      .optional()
      .describe(
        "Descripción breve de la categoría (opcional). Máximo 100 caracteres",
      ),
  })
  .openapi("Categoria");

export type CategoriaDTO = z.infer<typeof esquemaCategoria>;
