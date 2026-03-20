import { registro } from "@/config/openAPI/openAPI.registro.js";
import { z } from "zod";
import { esquemaCP } from "./cp.esquema.js";

const ETIQUETA = "Códigos Postales";

// GET /cp/:cp
registro.registerPath({
  method: "get",
  path: "/cp/{cp}",
  tags: [ETIQUETA],
  summary: "Obtener información de localidades por código postal",
  request: {
    params: z.object({
      cp: z.string().openapi({
        description: "Código postal (5 dígitos)",
        example: "28017",
      }),
    }),
  },
  responses: {
    200: {
      description: "Información de localidades obtenida exitosamente",
      content: {
        "application/json": {
          schema: z.object({
            mensaje: z.string(),
            datos: z.array(esquemaCP),
          }),
        },
      },
    },
    400: {
      description: "Código postal inválido o no encontrado",
    },
    500: {
      description: "Error al consultar el servicio de códigos postales",
    },
  },
});
