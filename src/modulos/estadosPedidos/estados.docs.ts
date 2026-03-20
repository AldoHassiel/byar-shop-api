import { registro } from "@/config/openAPI/openAPI.registro.js";
import { z } from "zod";
import { esquemaEstadoPedido } from "./estados.esquema.js";

const ETIQUETA = "Estados de Pedidos";

// GET /estadosPedidos
registro.registerPath({
  method: "get",
  path: "/estadosPedidos",
  tags: [ETIQUETA],
  summary: "Obtener lista de estados disponibles para los pedidos",
  responses: {
    200: {
      description: "Lista de estados de pedidos obtenida exitosamente",
      content: {
        "application/json": {
          schema: z.object({
            mensaje: z.string(),
            datos: z.array(esquemaEstadoPedido),
          }),
        },
      },
    },
    500: {
      description: "Error interno del servidor",
    },
  },
});
