import { registro } from "@/config/openAPI/openAPI.registro.js";
import { z } from "zod";

const ETIQUETA = "Estadísticas";

registro.registerPath({
    method: "get",
    path: "/estadisticas",
    tags: [ETIQUETA],
    summary: "Obtener estadísticas generales del sistema",
    security: [{ autenticacionBearer: [] }],
    responses: {
        200: {
            description: "Estadísticas obtenidas con éxito",
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
        500: { description: "Error interno del servidor" },
    },
});
