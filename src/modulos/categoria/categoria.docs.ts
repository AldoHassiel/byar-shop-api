import { registro } from "@/config/openAPI/openAPI.registro.js";
import { z } from "zod";
import { esquemaCategoria } from "./categoria.esquema.js";

const ETIQUETA = "Categorías";

// GET /categorias
registro.registerPath({
  method: "get",
  path: "/categorias",
  tags: [ETIQUETA],
  summary: "Listar todas las categorías",
  security: [{ autenticacionBearer: [] }],
  responses: {
    200: {
      description: "Lista de categorías obtenida exitosamente",
      content: {
        "application/json": {
          schema: z.object({
            mensaje: z.string(),
            datos: z.array(
              z.object({
                id: z.number(),
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

// GET /categorias/:id
registro.registerPath({
  method: "get",
  path: "/categorias/{id}",
  tags: [ETIQUETA],
  summary: "Obtener una categoría por ID",
  security: [{ autenticacionBearer: [] }],
  request: {
    params: z.object({
      id: z
        .string()
        .openapi({ description: "ID de la categoría", example: "1" }),
    }),
  },
  responses: {
    200: {
      description: "Categoría encontrada",
      content: {
        "application/json": {
          schema: z.object({
            mensaje: z.string(),
            datos: z.object({
              id: z.number(),
              nombre: z.string(),
              descripcion: z.string().nullable(),
            }),
          }),
        },
      },
    },
    401: { description: "No autorizado - token requerido" },
    404: { description: "Categoría no encontrada" },
  },
});

// POST /categorias
registro.registerPath({
  method: "post",
  path: "/categorias",
  tags: [ETIQUETA],
  summary: "Crear una nueva categoría (requiere rol admin)",
  security: [{ autenticacionBearer: [] }],
  request: {
    body: {
      description: "Datos de la nueva categoría",
      content: {
        "application/json": {
          schema: esquemaCategoria,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Categoría creada exitosamente",
      content: {
        "application/json": {
          schema: z.object({
            mensaje: z.string(),
            datos: z.any().optional(),
          }),
        },
      },
    },
    400: { description: "Error de validación en los datos" },
    401: { description: "No autorizado - no es administrador" },
  },
});

// PUT /categorias/:id
registro.registerPath({
  method: "put",
  path: "/categorias/{id}",
  tags: [ETIQUETA],
  summary: "Editar una categoría existente (requiere rol admin)",
  security: [{ autenticacionBearer: [] }],
  request: {
    params: z.object({
      id: z.string().openapi({ description: "ID de la categoría a editar" }),
    }),
    body: {
      description: "Nuevos datos de la categoría",
      content: {
        "application/json": {
          schema: esquemaCategoria,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Categoría editada exitosamente",
      content: {
        "application/json": {
          schema: z.object({
            mensaje: z.string(),
            datos: z.any().optional(),
          }),
        },
      },
    },
    400: { description: "Error de validación en los datos" },
    401: { description: "No autorizado - no es administrador" },
    404: { description: "Categoría no encontrada" },
  },
});

// DELETE /categorias/:id
registro.registerPath({
  method: "delete",
  path: "/categorias/{id}",
  tags: [ETIQUETA],
  summary: "Eliminar una categoría (requiere rol admin)",
  security: [{ autenticacionBearer: [] }],
  request: {
    params: z.object({
      id: z.string().openapi({ description: "ID de la categoría a eliminar" }),
    }),
  },
  responses: {
    200: {
      description: "Categoría eliminada exitosamente",
      content: {
        "application/json": {
          schema: z.object({
            mensaje: z.string(),
            datos: z.any().optional(),
          }),
        },
      },
    },
    401: { description: "No autorizado - no es administrador" },
    404: { description: "Categoría no encontrada" },
  },
});
