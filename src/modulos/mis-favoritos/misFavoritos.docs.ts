import { registro } from "@/config/openAPI/openAPI.registro.js";
import { z } from "zod";

const ETIQUETA = "Favoritos";

registro.registerPath({
  method: "get",
  path: "/usuarios/{usuarioId}/mis-favoritos",
  tags: [ETIQUETA],
  summary: "Obtener los productos favoritos del usuario",
  security: [{ autenticacionBearer: [] }],
  request: {
    params: z.object({
      usuarioId: z.string().openapi({
        description: "ID del usuario dueño de los favoritos",
        example: "1",
      }),
    }),
  },
  responses: {
    200: {
      description: "Favoritos obtenidos con éxito",
      content: {
        "application/json": {
          schema: z.object({
            mensaje: z.string(),
            datos: z.array(
              z.object({
                id: z.number(),
                imagen_url: z.string().nullable(),
                nombre: z.string(),
                descripcion: z.string().nullable(),
              }),
            ),
          }),
        },
      },
    },
    401: { description: "No autorizado - token requerido" },
  },
});

registro.registerPath({
  method: "delete",
  path: "/usuarios/{usuarioId}/mis-favoritos/eliminar/producto/{id}",
  tags: [ETIQUETA],
  summary: "Eliminar un producto de los favoritos del usuario",
  security: [{ autenticacionBearer: [] }],
  request: {
    params: z.object({
      usuarioId: z.string().openapi({
        description: "ID del usuario dueño de los favoritos",
      }),
      id: z.string().openapi({
        description: "ID del producto a eliminar de favoritos",
      }),
    }),
  },
  responses: {
    200: { description: "Producto eliminado de favoritos con éxito" },
    401: { description: "No autorizado - token requerido" },
  },
});

registro.registerPath({
  method: "post",
  path: "/usuarios/{usuarioId}/mis-favoritos/agregar/producto/{id}",
  tags: [ETIQUETA],
  summary: "Agregar un producto a los favoritos del usuario",
  security: [{ autenticacionBearer: [] }],
  request: {
    params: z.object({
      usuarioId: z.string().openapi({
        description: "ID del usuario dueño de los favoritos",
      }),
      id: z.string().openapi({
        description: "ID del producto a agregar a favoritos",
      }),
    }),
  },
  responses: {
    200: { description: "Producto agregado a favoritos con éxito" },
    401: { description: "No autorizado - token requerido" },
  },
});
