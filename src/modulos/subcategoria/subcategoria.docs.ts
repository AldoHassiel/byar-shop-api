import { registro } from "@/config/openAPI/openAPI.registro.js";
import { z } from "zod";
import { esquemaSubcategoria } from "./subcategoria.esquema.js";

const ETIQUETA = "Subcategorías";

// GET /subcategorias
registro.registerPath({
  method: "get",
  path: "/subcategorias",
  tags: [ETIQUETA],
  summary: "Listar todas las subcategorías",
  security: [{ autenticacionBearer: [] }],
  responses: {
    200: {
      description: "Lista de subcategorías obtenida exitosamente",
      content: {
        "application/json": {
          schema: z.object({
            mensaje: z.string(),
            datos: z.array(
              z.object({
                id: z.number(),
                id_categoria: z.number(),
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

// GET /subcategorias/:id
registro.registerPath({
  method: "get",
  path: "/subcategorias/{id}",
  tags: [ETIQUETA],
  summary: "Obtener una subcategoría por ID",
  security: [{ autenticacionBearer: [] }],
  request: {
    params: z.object({
      id: z
        .string()
        .openapi({ description: "ID de la subcategoría", example: "1" }),
    }),
  },
  responses: {
    200: {
      description: "Subcategoría encontrada",
      content: {
        "application/json": {
          schema: z.object({
            mensaje: z.string(),
            datos: z.object({
              id: z.number(),
              id_categoria: z.number(),
              nombre: z.string(),
              descripcion: z.string().nullable(),
            }),
          }),
        },
      },
    },
    401: { description: "No autorizado - token requerido" },
    404: { description: "Subcategoría no encontrada" },
  },
});

// POST /subcategorias
registro.registerPath({
  method: "post",
  path: "/subcategorias",
  tags: [ETIQUETA],
  summary: "Crear una nueva subcategoría (requiere rol admin)",
  security: [{ autenticacionBearer: [] }],
  request: {
    body: {
      description: "Datos de la nueva subcategoría",
      content: {
        "application/json": {
          schema: esquemaSubcategoria,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Subcategoría creada exitosamente",
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

// PUT /subcategorias/:id
registro.registerPath({
  method: "put",
  path: "/subcategorias/{id}",
  tags: [ETIQUETA],
  summary: "Editar una subcategoría existente (requiere rol admin)",
  security: [{ autenticacionBearer: [] }],
  request: {
    params: z.object({
      id: z.string().openapi({ description: "ID de la subcategoría a editar" }),
    }),
    body: {
      description: "Nuevos datos de la subcategoría",
      content: {
        "application/json": {
          schema: esquemaSubcategoria,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Subcategoría editada exitosamente",
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
    404: { description: "Subcategoría no encontrada" },
  },
});

// DELETE /subcategorias/:id
registro.registerPath({
  method: "delete",
  path: "/subcategorias/{id}",
  tags: [ETIQUETA],
  summary: "Eliminar una subcategoría (requiere rol admin)",
  security: [{ autenticacionBearer: [] }],
  request: {
    params: z.object({
      id: z
        .string()
        .openapi({ description: "ID de la subcategoría a eliminar" }),
    }),
  },
  responses: {
    200: {
      description: "Subcategoría eliminada exitosamente",
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
    404: { description: "Subcategoría no encontrada" },
  },
});
