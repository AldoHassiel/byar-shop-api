import { registro } from "@/config/openAPI/openAPI.registro.js";
import { z } from "zod";
import { esquemaMetodosPago } from "./metodosPago.esquema.js";

const ETIQUETA = "Métodos de Pago";

// GET /usuario/:usuarioId/metodosPago
registro.registerPath({
  method: "get",
  path: "/usuario/{usuarioId}/metodosPago",
  tags: [ETIQUETA],
  summary: "Listar todos los métodos de pago del usuario",
  security: [{ autenticacionBearer: [] }],
  request: {
    params: z.object({
      usuarioId: z.string().openapi({
        description: "ID del usuario dueño de los métodos de pago",
        example: "1",
      }),
    }),
  },
  responses: {
    200: {
      description: "Lista de métodos de pago obtenida exitosamente",
      content: {
        "application/json": {
          schema: z.object({
            mensaje: z.string(),
            datos: z.array(
              z.object({
                id: z.number(),
                id_usuario: z.number(),
                nombre_titular: z.string(),
                numero_tarjeta: z.string(),
                mes_vencimiento: z.string(),
                ano_vencimiento: z.string(),
                cvv: z.string(),
                marca: z.string(),
              }),
            ),
          }),
        },
      },
    },
    401: { description: "No autorizado - acceso denegado" },
  },
});

// GET /usuario/:usuarioId/metodosPago/:id
registro.registerPath({
  method: "get",
  path: "/usuario/{usuarioId}/metodosPago/{id}",
  tags: [ETIQUETA],
  summary: "Obtener un método de pago específico del usuario",
  security: [{ autenticacionBearer: [] }],
  request: {
    params: z.object({
      usuarioId: z
        .string()
        .openapi({ description: "ID del usuario dueño del método de pago" }),
      id: z
        .string()
        .openapi({ description: "ID del método de pago", example: "3" }),
    }),
  },
  responses: {
    200: {
      description: "Método de pago encontrado",
      content: {
        "application/json": {
          schema: z.object({
            mensaje: z.string(),
            datos: z.object({
              id: z.number(),
              id_usuario: z.number(),
              nombre_titular: z.string(),
              numero_tarjeta: z.string(),
              mes_vencimiento: z.string(),
              ano_vencimiento: z.string(),
              cvv: z.string(),
              marca: z.string(),
            }),
          }),
        },
      },
    },
    401: { description: "No autorizado - acceso denegado" },
    404: { description: "Método de pago no encontrado" },
  },
});

// POST /usuario/:usuarioId/metodosPago
registro.registerPath({
  method: "post",
  path: "/usuario/{usuarioId}/metodosPago",
  tags: [ETIQUETA],
  summary: "Crear un nuevo método de pago para el usuario",
  security: [{ autenticacionBearer: [] }],
  request: {
    params: z.object({
      usuarioId: z.string().openapi({ description: "ID del usuario" }),
    }),
    body: {
      description: "Datos del nuevo método de pago",
      content: {
        "application/json": {
          schema: esquemaMetodosPago,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Método de pago creado exitosamente",
      content: {
        "application/json": {
          schema: z.object({
            mensaje: z.string(),
            datos: z.any().optional(),
          }),
        },
      },
    },
    400: { description: "Error de validación en los datos de la tarjeta" },
    401: { description: "No autorizado - acceso denegado" },
  },
});

// PUT /usuario/:usuarioId/metodosPago/:id/predeterminada
registro.registerPath({
  method: "put",
  path: "/usuario/{usuarioId}/metodosPago/{id}/predeterminada",
  tags: [ETIQUETA],
  summary: "Establecer un método de pago como predeterminado",
  security: [{ autenticacionBearer: [] }],
  request: {
    params: z.object({
      usuarioId: z.string().openapi({ description: "ID del usuario" }),
      id: z.string().openapi({
        description: "ID del método de pago a establecer como predeterminado",
      }),
    }),
  },
  responses: {
    200: {
      description:
        "Método de pago establecido como predeterminado exitosamente",
      content: {
        "application/json": {
          schema: z.object({
            mensaje: z.string(),
            datos: z.any().optional(),
          }),
        },
      },
    },
    401: { description: "No autorizado - acceso denegado" },
    404: { description: "Método de pago no encontrado" },
  },
});

// DELETE /usuario/:usuarioId/metodosPago/:id
registro.registerPath({
  method: "delete",
  path: "/usuario/{usuarioId}/metodosPago/{id}",
  tags: [ETIQUETA],
  summary: "Eliminar un método de pago del usuario",
  security: [{ autenticacionBearer: [] }],
  request: {
    params: z.object({
      usuarioId: z.string().openapi({ description: "ID del usuario" }),
      id: z
        .string()
        .openapi({ description: "ID del método de pago a eliminar" }),
    }),
  },
  responses: {
    200: {
      description: "Método de pago eliminado exitosamente",
      content: {
        "application/json": {
          schema: z.object({
            mensaje: z.string(),
            datos: z.any().optional(),
          }),
        },
      },
    },
    401: { description: "No autorizado - acceso denegado" },
    404: { description: "Método de pago no encontrado" },
  },
});
