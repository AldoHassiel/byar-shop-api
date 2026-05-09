import { registro } from "@/config/openAPI/openAPI.registro.js";
import { z } from "zod";

const ETIQUETA = "Test";

registro.registerPath({
  method: "get",
  path: "/",
  tags: [ETIQUETA],
  summary: "Verificar que la API está en línea",
  responses: {
    200: {
      description: "Servidor en línea",
      content: {
        "text/html": {
          schema: z.string().openapi({ example: "<h1>Hola mundo</h1>" }),
        },
      },
    },
  },
});

registro.registerPath({
  method: "get",
  path: "/ping",
  tags: [ETIQUETA],
  summary: "Verificar la conexión con la base de datos",
  responses: {
    200: {
      description: "Respuesta del ping con fecha y hora",
      content: {
        "text/html": {
          schema: z.string().openapi({ example: "<p>2026-05-08T12:00:00.000Z<p>" }),
        },
      },
    },
  },
});
