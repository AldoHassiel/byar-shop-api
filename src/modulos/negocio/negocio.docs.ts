import { registro } from "@/config/openAPI/openAPI.registro.js";
import { z } from "zod";
import { esquemaEditarNegocio } from "./negocio.esquema.js";

const ETIQUETA = "Negocio";

registro.registerPath({
  method: "get",
  path: "/negocio",
  tags: [ETIQUETA],
  summary: "Obtener la información actual del negocio",
  responses: {
    200: {
      description: "Información del negocio obtenida con éxito",
      content: {
        "application/json": {
          schema: z.object({
            mensaje: z.string(),
            datos: z.array(
              z.object({
                id: z.number().optional(),
                nombre: z.string().nullable(),
                whatsapp: z.string().nullable(),
                sobre_nosotros: z.string().nullable(),
                instagram: z.string().nullable(),
                direccion: z.string().nullable(),
                dias_laborales: z.string().nullable(),
                hora_de_apertura: z.string().nullable(),
                hora_de_cierre: z.string().nullable(),
                logotipo_url: z.string().nullable(),
                imagen_sobre_nosotros_url: z.string().nullable(),
                hero_imagen_url: z.string().nullable(),
              }),
            ),
          }),
        },
      },
    },
    404: { description: "Información del negocio no encontrada" },
  },
});

registro.registerPath({
  method: "put",
  path: "/negocio",
  tags: [ETIQUETA],
  summary: "Editar la información del negocio (requiere rol admin)",
  security: [{ autenticacionBearer: [] }],
  request: {
    body: {
      description: "Datos actualizados del negocio",
      content: {
        "multipart/form-data": {
          schema: esquemaEditarNegocio.extend({
            logotipo: z.any().optional().openapi({
              type: "string",
              format: "binary",
              description: "Imagen del logotipo",
            }),
            imagen_sobre_nosotros: z.any().optional().openapi({
              type: "string",
              format: "binary",
              description: "Imagen de la sección 'Sobre nosotros'",
            }),
            hero_imagen: z.any().optional().openapi({
              type: "string",
              format: "binary",
              description: "Imagen principal del sitio",
            }),
          }),
        },
      },
    },
  },
  responses: {
    200: { description: "Negocio editado con éxito" },
    400: { description: "Error de validación" },
    401: { description: "No autorizado" },
  },
});
