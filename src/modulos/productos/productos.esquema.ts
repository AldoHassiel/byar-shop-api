import z from "zod";

export const esquemaProducto = z.object({
  nombre: z.string(),
  descripcion: z.string().optional(),
  precio: z.coerce.number(),
  stock: z.coerce.number(),
  imagen_url: z.string().optional(),
  id_subcategoria: z.coerce.number(),
  id_marca: z.coerce.number(),
});

export const esquemaProductoEditado = z.object({
  nombre: z.string(),
  descripcion: z.string().optional(),
  precio: z.coerce.number(),
  stock: z.coerce.number(),
  imagen_url: z.string().optional(),
  id_subcategoria: z.coerce.number(),
  id_marca: z.coerce.number(),
  accion_imagen: z.enum(["conservar", "nueva", "eliminar"]),
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
export type ProductoEditadoDTO = z.infer<typeof esquemaProductoEditado>;
export type FiltrosProductoDTO = z.infer<typeof esquemaFiltrosProducto>;
