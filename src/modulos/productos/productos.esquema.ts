import z from "zod";

export const esquemaProducto = z.object({
  nombre: z.string(),
  descripcion: z.string().optional(),
  precio: z.number(),
  stock: z.number(),
  imagen_url: z.string().optional(),
  id_subcategoria: z.number(),
  id_marca: z.number(),
});

export const esquemaFiltrosProducto = z.object({
  nombre: z.string().optional(),
  precio_min: z.coerce.number().positive().optional(),
  precio_max: z.coerce.number().positive().optional(),
  id_marca: z.coerce.number().int().positive().optional(),
  id_categoria: z.coerce.number().int().positive().optional(),
  id_subcategoria: z.coerce.number().int().positive().optional(),
  pagina: z.coerce.number().int().positive().optional(),
  limite: z.coerce.number().int().positive().optional(),
});

export type ProductoDTO = z.infer<typeof esquemaProducto>;
export type FiltrosProductoDTO = z.infer<typeof esquemaFiltrosProducto>;
