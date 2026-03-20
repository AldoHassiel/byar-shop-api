import { registro } from "@/config/openAPI/openAPI.registro.js";
import { z } from "zod";
import {
  esquemaFiltrosProducto,
  esquemaProducto,
  esquemaProductoEditado,
  esquemaProductoObtenido,
} from "./productos.esquema.js";

const ETIQUETA = "Productos";

// GET /productos
registro.registerPath({
  method: "get",
  path: "/productos",
  tags: [ETIQUETA],
  summary: "Listar productos con filtros",
  request: {
    query: esquemaFiltrosProducto,
  },
  responses: {
    200: {
      description: "Lista de productos obtenida con éxito",
      content: {
        "application/json": {
          schema: z.object({
            mensaje: z.string(),
            datos: z.object({
              total_paginas: z
                .number()
                .describe("Total de páginas disponibles"),
              productos: z.array(esquemaProductoObtenido),
            }),
          }),
        },
      },
    },
  },
});

// GET /productos/:id
registro.registerPath({
  method: "get",
  path: "/productos/{id}",
  tags: [ETIQUETA],
  summary: "Obtener un producto por ID",
  request: {
    params: z.object({
      id: z.string().openapi({ description: "ID del producto", example: "5" }),
    }),
  },
  responses: {
    200: {
      description: "Producto encontrado",
      content: {
        "application/json": {
          schema: z.object({
            mensaje: z.string(),
            datos: esquemaProductoObtenido,
          }),
        },
      },
    },
    400: { description: "ID inválido" },
    404: { description: "Producto no encontrado" },
  },
});

// POST /productos
registro.registerPath({
  method: "post",
  path: "/productos",
  tags: [ETIQUETA],
  summary: "Crear un producto (requiere rol admin)",
  security: [{ autenticacionBearer: [] }],
  request: {
    body: {
      description: "Datos del producto + imagen opcional",
      content: {
        "multipart/form-data": {
          schema: esquemaProducto.extend({
            imagen: z.instanceof(File).optional().openapi({
              type: "string",
              format: "binary",
              description: "Imagen del producto",
            }),
          }),
        },
      },
    },
  },
  responses: {
    200: { description: "Producto creado con éxito" },
    400: { description: "Error de validación" },
    401: { description: "No autorizado" },
    409: { description: "Ya existe ese producto" },
  },
});

// PUT /productos/:id
registro.registerPath({
  method: "put",
  path: "/productos/{id}",
  tags: [ETIQUETA],
  summary: "Editar un producto (requiere rol admin)",
  security: [{ autenticacionBearer: [] }],
  request: {
    params: z.object({
      id: z.string().openapi({ description: "ID del producto" }),
    }),
    body: {
      content: {
        "multipart/form-data": {
          schema: esquemaProductoEditado.extend({
            imagen: z.instanceof(File).optional().openapi({
              type: "string",
              format: "binary",
              description: "Nueva imagen del producto",
            }),
          }),
        },
      },
    },
  },
  responses: {
    200: { description: "Producto editado con éxito" },
    400: { description: "Error de validación" },
    401: { description: "No autorizado" },
  },
});

// DELETE /productos/:id
registro.registerPath({
  method: "delete",
  path: "/productos/{id}",
  tags: [ETIQUETA],
  summary: "Eliminar un producto (requiere rol admin)",
  security: [{ autenticacionBearer: [] }],
  request: {
    params: z.object({
      id: z.string().openapi({ description: "ID del producto a eliminar" }),
    }),
  },
  responses: {
    200: {
      description: "Producto eliminado con éxito",
      content: {
        "application/json": {
          schema: z.object({
            mensaje: z.string(),
            datos: z.any().optional(),
          }),
        },
      },
    },
    401: { description: "No autorizado" },
    404: { description: "Producto no encontrado" },
  },
});
