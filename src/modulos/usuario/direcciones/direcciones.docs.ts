import { registro } from "@/config/openAPI/openAPI.registro.js";
import { z } from "zod";
import { esquemaDireccones } from "./direcciones.esquema.js";

const ETIQUETA = "Direcciones";

// GET /usuario/:usuarioId/direcciones
registro.registerPath({
  method: "get",
  path: "/usuario/{usuarioId}/direcciones",
  tags: [ETIQUETA],
  summary: "Listar todas las direcciones del usuario",
  security: [{ autenticacionBearer: [] }],
  request: {
    params: z.object({
      usuarioId: z.string().openapi({
        description: "ID del usuario dueño de las direcciones",
        example: "1",
      }),
    }),
  },
  responses: {
    200: {
      description: "Lista de direcciones obtenida exitosamente",
      content: {
        "application/json": {
          schema: z.object({
            mensaje: z.string(),
            datos: z.array(
              z.object({
                id: z.number(),
                id_usuario: z.number(),
                calle: z.string(),
                numero_exterior: z.string(),
                numero_interior: z.string(),
                colonia: z.string(),
                ciudad: z.string(),
                municipio: z.string(),
                estado: z.string(),
                codigo_postal: z.string(),
                especificaciones: z.string(),
              }),
            ),
          }),
        },
      },
    },
    401: { description: "No autorizado - acceso denegado" },
  },
});

// GET /usuario/:usuarioId/direcciones/:id
registro.registerPath({
  method: "get",
  path: "/usuario/{usuarioId}/direcciones/{id}",
  tags: [ETIQUETA],
  summary: "Obtener una dirección específica del usuario",
  security: [{ autenticacionBearer: [] }],
  request: {
    params: z.object({
      usuarioId: z
        .string()
        .openapi({ description: "ID del usuario dueño de la dirección" }),
      id: z
        .string()
        .openapi({ description: "ID de la dirección", example: "5" }),
    }),
  },
  responses: {
    200: {
      description: "Dirección encontrada",
      content: {
        "application/json": {
          schema: z.object({
            mensaje: z.string(),
            datos: z.object({
              id: z.number(),
              id_usuario: z.number(),
              calle: z.string(),
              numero_exterior: z.string(),
              numero_interior: z.string(),
              colonia: z.string(),
              ciudad: z.string(),
              municipio: z.string(),
              estado: z.string(),
              codigo_postal: z.string(),
              especificaciones: z.string(),
            }),
          }),
        },
      },
    },
    401: { description: "No autorizado - acceso denegado" },
    404: { description: "Dirección no encontrada" },
  },
});

// POST /usuario/:usuarioId/direcciones
registro.registerPath({
  method: "post",
  path: "/usuario/{usuarioId}/direcciones",
  tags: [ETIQUETA],
  summary: "Crear una nueva dirección para el usuario",
  security: [{ autenticacionBearer: [] }],
  request: {
    params: z.object({
      usuarioId: z.string().openapi({ description: "ID del usuario" }),
    }),
    body: {
      description: "Datos de la nueva dirección",
      content: {
        "application/json": {
          schema: esquemaDireccones,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Dirección creada exitosamente",
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
    401: { description: "No autorizado - acceso denegado" },
  },
});

// PUT /usuario/:usuarioId/direcciones/:id (Editar)
registro.registerPath({
  method: "put",
  path: "/usuario/{usuarioId}/direcciones/{id}",
  tags: [ETIQUETA],
  summary: "Editar una dirección existente del usuario",
  security: [{ autenticacionBearer: [] }],
  request: {
    params: z.object({
      usuarioId: z.string().openapi({ description: "ID del usuario" }),
      id: z.string().openapi({ description: "ID de la dirección a editar" }),
    }),
    body: {
      description: "Nuevos datos de la dirección",
      content: {
        "application/json": {
          schema: esquemaDireccones,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Dirección editada exitosamente",
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
    401: { description: "No autorizado - acceso denegado" },
    404: { description: "Dirección no encontrada" },
  },
});

// PATCH /usuario/:usuarioId/direcciones/:id/predeterminada
registro.registerPath({
  method: "patch",
  path: "/usuario/{usuarioId}/direcciones/{id}/predeterminada",
  tags: [ETIQUETA],
  summary: "Establecer una dirección como predeterminada",
  security: [{ autenticacionBearer: [] }],
  request: {
    params: z.object({
      usuarioId: z.string().openapi({ description: "ID del usuario" }),
      id: z.string().openapi({
        description: "ID de la dirección a establecer como predeterminada",
      }),
    }),
  },
  responses: {
    200: {
      description: "Dirección establecida como predeterminada exitosamente",
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
    404: { description: "Dirección no encontrada" },
  },
});

// DELETE /usuario/:usuarioId/direcciones/:id
registro.registerPath({
  method: "delete",
  path: "/usuario/{usuarioId}/direcciones/{id}",
  tags: [ETIQUETA],
  summary: "Eliminar una dirección del usuario",
  security: [{ autenticacionBearer: [] }],
  request: {
    params: z.object({
      usuarioId: z.string().openapi({ description: "ID del usuario" }),
      id: z.string().openapi({ description: "ID de la dirección a eliminar" }),
    }),
  },
  responses: {
    200: {
      description: "Dirección eliminada exitosamente",
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
    404: { description: "Dirección no encontrada" },
  },
});
