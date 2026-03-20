import { registro } from "@/config/openAPI/openAPI.registro.js";
import { z } from "zod";
import { esquemaRegistro } from "../autenticacion/autenticacion.esquema.js";

const ETIQUETA = "Administración";

// POST /admin/crear
registro.registerPath({
  method: "post",
  path: "/admin/crear",
  tags: [ETIQUETA],
  summary: "Crear un nuevo usuario administrador (requiere rol admin)",
  security: [{ autenticacionBearer: [] }],
  request: {
    body: {
      description: "Datos del nuevo usuario administrador",
      content: {
        "application/json": {
          schema: esquemaRegistro,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Administrador creado exitosamente",
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
    401: { description: "No autorizado - no es administrador" },
    409: { description: "El correo ya está registrado en el sistema" },
  },
});
