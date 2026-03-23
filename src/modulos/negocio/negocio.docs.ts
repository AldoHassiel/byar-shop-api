import { registro } from "@/config/openAPI/openAPI.registro.js";
import { z } from "zod";
import {
    esquemaNegocio,
} from "./negocio.esquema.js";

const ETIQUETA = "Negocio";

registro.registerPath({
    method: "get",
    path: "/negocio",
    tags: [ETIQUETA],
    summary: "Obtener la información del negocio",
    responses: {
        200: {
            description: "Información del negocio obtenida con éxito",
            content: {
                "application/json": {
                    schema: z.object({
                        mensaje: z.string(),
                        datos: esquemaNegocio,
                    }),
                },
            },
        },
    },
});