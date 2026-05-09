import { registro } from "@/config/openAPI/openAPI.registro.js";
import { z } from "zod";
import {
    esquemaEditarCorreo,
    esquemaEditarMisDatos,
    esquemaEditarPwd,
} from "./misDatos.esquema.js";

const ETIQUETA = "Mis Datos";

registro.registerPath({
    method: "get",
    path: "/usuario/{usuarioId}/misDatos",
    tags: [ETIQUETA],
    summary: "Obtener los datos del usuario",
    security: [{ autenticacionBearer: [] }],
    request: {
        params: z.object({
            usuarioId: z.string().openapi({
                description: "ID del usuario",
                example: "1",
            }),
        }),
    },
    responses: {
        200: {
            description: "Datos del usuario obtenidos con éxito",
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
    },
});

registro.registerPath({
    method: "put",
    path: "/usuario/{usuarioId}/misDatos/editar",
    tags: [ETIQUETA],
    summary: "Editar los datos generales del usuario",
    security: [{ autenticacionBearer: [] }],
    request: {
        params: z.object({
            usuarioId: z.string().openapi({
                description: "ID del usuario",
            }),
        }),
        body: {
            description: "Datos generales del usuario a actualizar",
            content: {
                "application/json": {
                    schema: esquemaEditarMisDatos,
                },
            },
        },
    },
    responses: {
        200: { description: "Datos editados exitosamente" },
        400: { description: "Error de validación" },
        401: { description: "No autorizado - token requerido" },
        409: { description: "No se pudo editar los datos" },
    },
});

registro.registerPath({
    method: "patch",
    path: "/usuario/{usuarioId}/misDatos/correo",
    tags: [ETIQUETA],
    summary: "Editar el correo electrónico del usuario",
    security: [{ autenticacionBearer: [] }],
    request: {
        params: z.object({
            usuarioId: z.string().openapi({
                description: "ID del usuario",
            }),
        }),
        body: {
            description: "Nuevo correo y contraseña actual",
            content: {
                "application/json": {
                    schema: esquemaEditarCorreo,
                },
            },
        },
    },
    responses: {
        200: { description: "Correo editado exitosamente" },
        400: { description: "Error de validación" },
        401: { description: "No autorizado - token requerido" },
        409: { description: "Correo ya existente o contraseña inválida" },
    },
});

registro.registerPath({
    method: "patch",
    path: "/usuario/{usuarioId}/misDatos/pwd",
    tags: [ETIQUETA],
    summary: "Editar la contraseña del usuario",
    security: [{ autenticacionBearer: [] }],
    request: {
        params: z.object({
            usuarioId: z.string().openapi({
                description: "ID del usuario",
            }),
        }),
        body: {
            description: "Contraseña actual y nueva contraseña",
            content: {
                "application/json": {
                    schema: esquemaEditarPwd,
                },
            },
        },
    },
    responses: {
        200: { description: "Contraseña editada exitosamente" },
        400: { description: "Error de validación" },
        401: { description: "No autorizado - token requerido" },
        409: { description: "Contraseña actual incorrecta o no se pudo editar" },
    },
});

registro.registerPath({
    method: "delete",
    path: "/usuario/{usuarioId}/misDatos/cuenta",
    tags: [ETIQUETA],
    summary: "Eliminar la cuenta del usuario",
    security: [{ autenticacionBearer: [] }],
    request: {
        params: z.object({
            usuarioId: z.string().openapi({
                description: "ID del usuario",
            }),
        }),
    },
    responses: {
        200: { description: "Cuenta eliminada exitosamente" },
        401: { description: "No autorizado - token requerido" },
        409: { description: "No se pudo eliminar la cuenta" },
    },
});
