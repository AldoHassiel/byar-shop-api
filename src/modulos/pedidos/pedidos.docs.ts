import { registro } from "@/config/openAPI/openAPI.registro.js";
import { z } from "zod";
import { esquemaFiltrosPedidos } from "./pedidos.esquema.js";

const ETIQUETA = "Pedidos";

registro.registerPath({
  method: "get",
  path: "/pedidos",
  tags: [ETIQUETA],
  summary: "Listar los pedidos del sistema",
  security: [{ autenticacionBearer: [] }],
  request: {
    query: esquemaFiltrosPedidos,
  },
  responses: {
    200: {
      description: "Pedidos obtenidos con éxito",
      content: {
        "application/json": {
          schema: z.object({
            mensaje: z.string(),
            datos: z.array(z.any()),
          }),
        },
      },
    },
    400: { description: "Error de validación en los filtros" },
    401: { description: "No autorizado - token requerido" },
  },
});

registro.registerPath({
  method: "get",
  path: "/pedidos/{id}",
  tags: [ETIQUETA],
  summary: "Obtener el detalle de un pedido",
  security: [{ autenticacionBearer: [] }],
  request: {
    params: z.object({
      id: z.string().openapi({
        description: "ID del pedido",
        example: "1",
      }),
    }),
  },
  responses: {
    200: {
      description: "Pedido obtenido con éxito",
      content: {
        "application/json": {
          schema: z.object({
            mensaje: z.string(),
            datos: z.any(),
          }),
        },
      },
    },
    400: { description: "ID inválido" },
    401: { description: "No autorizado - token requerido" },
    404: { description: "Pedido no encontrado" },
  },
});

registro.registerPath({
  method: "patch",
  path: "/pedidos/{id}",
  tags: [ETIQUETA],
  summary: "Cambiar el estado de un pedido",
  security: [{ autenticacionBearer: [] }],
  request: {
    params: z.object({
      id: z.string().openapi({
        description: "ID del pedido",
      }),
    }),
    body: {
      description: "Nuevo estado del pedido",
      content: {
        "application/json": {
          schema: z.object({
            id_estado: z.number().openapi({
              description: "ID del nuevo estado",
            }),
          }),
        },
      },
    },
  },
  responses: {
    200: { description: "Estado del pedido actualizado con éxito" },
    400: { description: "Error en los datos enviados" },
    401: { description: "No autorizado - token requerido" },
  },
});
