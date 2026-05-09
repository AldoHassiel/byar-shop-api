import { registro } from "@/config/openAPI/openAPI.registro.js";
import { z } from "zod";
import { esquemaCompra } from "./compras.esquema.js";

const ETIQUETA = "Compras";

registro.registerPath({
    method: "get",
    path: "/usuario/{usuarioId}/compras",
    tags: [ETIQUETA],
    summary: "Listar todas las compras de un usuario",
    security: [{ autenticacionBearer: [] }],
    request: {
        params: z.object({
            usuarioId: z.string().openapi({
                description: "ID del usuario dueño de las compras",
                example: "1",
            }),
        }),
    },
    responses: {
        200: {
            description: "Compras obtenidas con éxito",
            content: {
                "application/json": {
                    schema: z.object({
                        mensaje: z.string(),
                        datos: z.array(z.any()),
                    }),
                },
            },
        },
        401: { description: "No autorizado - token requerido" },
    },
});

registro.registerPath({
    method: "get",
    path: "/usuario/{usuarioId}/compras/{id}",
    tags: [ETIQUETA],
    summary: "Obtener el detalle de una compra específica",
    security: [{ autenticacionBearer: [] }],
    request: {
        params: z.object({
            usuarioId: z.string().openapi({
                description: "ID del usuario dueño de la compra",
            }),
            id: z.string().openapi({
                description: "ID de la compra",
                example: "1",
            }),
        }),
    },
    responses: {
        200: {
            description: "Detalle de compra obtenido con éxito",
            content: {
                "application/json": {
                    schema: z.object({
                        mensaje: z.string(),
                        datos: z.any(),
                    }),
                },
            },
        },
        401: { description: "No autorizado - token requerido" },
        404: { description: "Compra no encontrada" },
    },
});

registro.registerPath({
    method: "post",
    path: "/usuario/{usuarioId}/compras",
    tags: [ETIQUETA],
    summary: "Realizar una compra para el usuario",
    security: [{ autenticacionBearer: [] }],
    request: {
        params: z.object({
            usuarioId: z.string().openapi({
                description: "ID del usuario que realiza la compra",
            }),
        }),
        body: {
            description: "Datos de la compra",
            content: {
                "application/json": {
                    schema: esquemaCompra,
                },
            },
        },
    },
    responses: {
        200: { description: "Compra realizada con éxito" },
        400: { description: "Error de validación o stock insuficiente" },
        401: { description: "No autorizado - token requerido" },
        409: { description: "Error de stock o conflicto de compra" },
    },
});
