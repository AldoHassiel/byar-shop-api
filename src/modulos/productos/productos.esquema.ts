import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const esquemaProducto = z
  .object({
    nombre: z
      .string()
      .describe("Nombre del producto. Debe ser único en el sistema"),
    descripcion: z
      .string()
      .optional()
      .describe(
        "Descripción detallada del producto, características y especificaciones",
      ),
    precio: z.coerce
      .number()
      .describe(
        "Precio del producto en Pesos Mexicanos (MXN). Ejemplo: 299.99",
      ),
    stock: z.coerce
      .number()
      .describe("Cantidad de unidades disponibles en inventario. Ejemplo: 50"),
    imagen_url: z
      .string()
      .optional()
      .describe("URL de la imagen del producto alojada en el servidor"),
    id_subcategoria: z.coerce
      .number()
      .describe("ID de la subcategoría a la que pertenece el producto"),
    id_marca: z.coerce.number().describe("ID de la marca del producto"),
  })
  .openapi("Producto");

export const esquemaProductoEditado = z
  .object({
    nombre: z.string().describe("Nombre del producto actualizado"),
    descripcion: z
      .string()
      .optional()
      .describe("Nueva descripción del producto"),
    precio: z.coerce.number().describe("Nuevo precio en Pesos Mexicanos (MXN)"),
    stock: z.coerce
      .number()
      .describe("Nuevas unidades disponibles en inventario"),
    imagen_url: z
      .string()
      .optional()
      .describe("URL de la imagen actual del producto"),
    id_subcategoria: z.coerce
      .number()
      .describe("ID de la subcategoría del producto"),
    id_marca: z.coerce.number().describe("ID de la marca del producto"),
    accion_imagen: z
      .enum(["conservar", "nueva", "eliminar"])
      .describe(
        "Acción a realizar con la imagen: conservar la actual, subir una nueva, o eliminarla",
      ),
  })
  .openapi("ProductoEditado");

export const esquemaFiltrosProducto = z
  .object({
    nombre: z
      .string()
      .optional()
      .describe("Filtro opcional por nombre del producto"),
    precio_min: z.coerce
      .number()
      .positive()
      .optional()
      .describe("Precio mínimo para filtrar productos (MXN). Ejemplo: 100"),
    precio_max: z.coerce
      .number()
      .positive()
      .optional()
      .describe("Precio máximo para filtrar productos (MXN). Ejemplo: 1000"),
    id_marca: z.coerce
      .number()
      .int()
      .positive()
      .optional()
      .describe("Filtro opcional por ID de marca"),
    id_categoria: z.coerce
      .number()
      .int()
      .positive()
      .optional()
      .describe("Filtro opcional por ID de categoría"),
    id_subcategoria: z.coerce
      .number()
      .int()
      .positive()
      .optional()
      .describe("Filtro opcional por ID de subcategoría"),
    pagina: z.coerce
      .number()
      .int()
      .positive()
      .optional()
      .describe("Número de página para paginación (comienza en 1). Ejemplo: 1"),
    limite: z.coerce
      .number()
      .int()
      .positive()
      .optional()
      .describe(
        "Cantidad de registros por página (por defecto 20). Ejemplo: 20",
      ),
  })
  .openapi("FiltrosProducto");

export type ProductoDTO = z.infer<typeof esquemaProducto>;
export type ProductoEditadoDTO = z.infer<typeof esquemaProductoEditado>;
export type FiltrosProductoDTO = z.infer<typeof esquemaFiltrosProducto>;

// Esquema de respuesta para GET /productos (producto obtenido de la BD)
export const esquemaProductoObtenido = z
  .object({
    id: z.number().describe("ID único del producto"),
    nombre: z.string().describe("Nombre del producto"),
    descripcion: z.string().nullable().describe("Descripción del producto"),
    precio: z.string().describe("Precio en formato string (ej: 99.99)"),
    stock: z.number().describe("Unidades disponibles"),
    imagen_url: z.string().describe("URL de la imagen del producto"),
    nombre_categoria: z
      .string()
      .describe("Nombre de la categoría a la que pertenece"),
    nombre_subcategoria: z
      .string()
      .describe("Nombre de la subcategoría a la que pertenece"),
    nombre_marca: z.string().describe("Nombre de la marca del producto"),
  })
  .openapi("ProductoObtenido");

export type ProductoObtenidoDTO = z.infer<typeof esquemaProductoObtenido>;
