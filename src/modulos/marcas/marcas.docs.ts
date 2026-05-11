import { registro } from "@/config/openAPI/openAPI.registro.js";
import { z } from "zod";
import { esquemaMarca } from "./marcas.esquema.js";

const ETIQUETA = "Marcas";

// GET /marcas
registro.registerPath({
  method: "get",
  path: "/marcas",
  tags: [ETIQUETA],
  summary: "Listar todas las marcas",
  responses: {
    200: {
      description: "Lista de marcas obtenida exitosamente",
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
  },
});

// GET /marcas/:id
registro.registerPath({
  method: "get",
  path: "/marcas/{id}",
  tags: [ETIQUETA],
  summary: "Obtener una marca por ID",
  request: {
    params: z.object({
      id: z.string().openapi({ description: "ID de la marca", example: "1" }),
    }),
  },
  responses: {
    200: {
      description: "Marca encontrada",
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
    404: { description: "Marca no encontrada" },
  },
});

// POST /marcas
registro.registerPath({
  method: "post",
  path: "/marcas",
  tags: [ETIQUETA],
  summary: "Crear una nueva marca (requiere rol admin)",
  security: [{ autenticacionBearer: [] }],
  request: {
    body: {
      description: "Datos de la nueva marca",
      content: {
        "application/json": {
          schema: esquemaMarca,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Marca creada exitosamente",
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

// PUT /marcas/:id
registro.registerPath({
  method: "put",
  path: "/marcas/{id}",
  tags: [ETIQUETA],
  summary: "Editar una marca existente (requiere rol admin)",
  security: [{ autenticacionBearer: [] }],
  request: {
    params: z.object({
      id: z.string().openapi({ description: "ID de la marca a editar" }),
    }),
    body: {
      description: "Nuevos datos de la marca",
      content: {
        "application/json": {
          schema: esquemaMarca,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Marca editada exitosamente",
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
    404: { description: "Marca no encontrada" },
  },
});

// DELETE /marcas/:id
registro.registerPath({
  method: "delete",
  path: "/marcas/{id}",
  tags: [ETIQUETA],
  summary: "Eliminar una marca (requiere rol admin)",
  security: [{ autenticacionBearer: [] }],
  request: {
    params: z.object({
      id: z.string().openapi({ description: "ID de la marca a eliminar" }),
    }),
  },
  responses: {
    200: {
      description: "Marca eliminada exitosamente",
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
    404: { description: "Marca no encontrada" },
  },
});
