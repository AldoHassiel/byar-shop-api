import { registro } from "@/config/openAPI/openAPI.registro.js";
import { z } from "zod";
import {
  esquemaRegistro,
  esquemaInicioSesion,
} from "./autenticacion.esquema.js";

const ETIQUETA = "Autenticación";

// POST /auth/registrar
registro.registerPath({
  method: "post",
  path: "/auth/registrar",
  tags: [ETIQUETA],
  summary: "Registrar un nuevo usuario",
  request: {
    body: {
      description: "Datos del nuevo usuario a registrar",
      content: {
        "application/json": {
          schema: esquemaRegistro,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Usuario registrado exitosamente",
      content: {
        "application/json": {
          schema: z.object({
            mensaje: z.string(),
            datos: z.object({
              id: z.number(),
              nombre: z.string(),
              apellidos: z.string().nullable(),
              telefono: z.string().nullable(),
              correo: z.string(),
              activo: z.boolean(),
              es_admin: z.boolean(),
            }),
          }),
        },
      },
    },
    400: { description: "Error de validación en los datos ingresados" },
    409: { description: "El correo ya está registrado en el sistema" },
  },
});

// POST /auth/iniciarSesion
registro.registerPath({
  method: "post",
  path: "/auth/iniciarSesion",
  tags: [ETIQUETA],
  summary: "Iniciar sesión con correo y contraseña",
  request: {
    body: {
      description: "Credenciales de acceso del usuario",
      content: {
        "application/json": {
          schema: esquemaInicioSesion,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Sesión iniciada exitosamente",
      content: {
        "application/json": {
          schema: z.object({
            mensaje: z.string(),
            datos: z.object({
              id: z.number(),
              nombre: z.string(),
              apellidos: z.string().nullable(),
              telefono: z.string().nullable(),
              correo: z.string(),
              activo: z.boolean(),
              es_admin: z.boolean(),
            }),
          }),
        },
      },
    },
    400: { description: "Error de validación en las credenciales" },
    401: { description: "Correo o contraseña incorrectos" },
  },
});

// POST /auth/cerrarSesion
registro.registerPath({
  method: "post",
  path: "/auth/cerrarSesion",
  tags: [ETIQUETA],
  summary: "Cerrar la sesión del usuario actual",
  request: {
    body: {
      description: "No requiere body específico",
      content: {
        "application/json": {
          schema: z.object({}),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Sesión cerrada correctamente",
      content: {
        "application/json": {
          schema: z.object({
            mensaje: z.string(),
            datos: z.any().optional(),
          }),
        },
      },
    },
  },
});
