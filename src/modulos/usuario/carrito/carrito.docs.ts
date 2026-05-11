import { registro } from "@/config/openAPI/openAPI.registro.js";
import { z } from "zod";
import {
    esquemaCarritoActualizar,
    esquemaCarritoAgregar,
    esquemaCarritoObtener,
} from "./carrito.esquema.js";

const ETIQUETA = "Carrito";

registro.registerPath({
    method: "get",
    path: "/usuario/{usuarioId}/carrito",
    tags: [ETIQUETA],
    summary: "Obtener el carrito de un usuario",
    security: [{ autenticacionBearer: [] }],
    request: {
        params: z.object({
            usuarioId: z.string().openapi({
                description: "ID del usuario dueño del carrito",
                example: "1",
            }),
        }),
        query: esquemaCarritoObtener,
    },
    responses: {
        200: {
            description: "Carrito obtenido con éxito",
            content: {
                "application/json": {
                    schema: z.object({
                        mensaje: z.string(),
                        datos: z.array(z.any()),
                    }),
                },
            },
        },
        400: { description: "Error en los parámetros de consulta" },
        401: { description: "No autorizado - token requerido" },
    },
});

registro.registerPath({
    method: "post",
    path: "/usuario/{usuarioId}/carrito",
    tags: [ETIQUETA],
    summary: "Agregar un producto al carrito",
    security: [{ autenticacionBearer: [] }],
    request: {
        params: z.object({
            usuarioId: z.string().openapi({
                description: "ID del usuario dueño del carrito",
            }),
        }),
        body: {
            description: "Producto y cantidad a agregar al carrito",
            content: {
                "application/json": {
                    schema: esquemaCarritoAgregar,
                },
            },
        },
    },
    responses: {
        200: { description: "Producto agregado al carrito con éxito" },
        400: { description: "Error de validación" },
        401: { description: "No autorizado - token requerido" },
    },
});

registro.registerPath({
    method: "patch",
    path: "/usuario/{usuarioId}/carrito/{productoId}",
    tags: [ETIQUETA],
    summary: "Actualizar la cantidad de un producto en el carrito",
    security: [{ autenticacionBearer: [] }],
    request: {
        params: z.object({
            usuarioId: z.string().openapi({
                description: "ID del usuario dueño del carrito",
            }),
            productoId: z.string().openapi({
                description: "ID del producto en el carrito",
            }),
        }),
        body: {
            description: "Cambio de cantidad del producto en el carrito",
            content: {
                "application/json": {
                    schema: esquemaCarritoActualizar,
                },
            },
        },
    },
    responses: {
        200: { description: "Cantidad actualizada con éxito" },
        400: { description: "Error de validación" },
        401: { description: "No autorizado - token requerido" },
    },
});

registro.registerPath({
    method: "delete",
    path: "/usuario/{usuarioId}/carrito/{productoId}",
    tags: [ETIQUETA],
    summary: "Eliminar un producto del carrito",
    security: [{ autenticacionBearer: [] }],
    request: {
        params: z.object({
            usuarioId: z.string().openapi({
                description: "ID del usuario dueño del carrito",
            }),
            productoId: z.string().openapi({
                description: "ID del producto a eliminar del carrito",
            }),
        }),
    },
    responses: {
        200: { description: "Producto eliminado del carrito con éxito" },
        401: { description: "No autorizado - token requerido" },
    },
});
