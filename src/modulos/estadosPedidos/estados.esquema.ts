import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import z from "zod";

extendZodWithOpenApi(z);

export const esquemaEstadoPedido = z
  .object({
    id: z.number().describe("ID único del estado del pedido"),
    nombre: z
      .string()
      .describe(
        "Nombre del estado (ej: Pendiente, En Preparación, Enviado, etc)",
      ),
  })
  .openapi("EstadoPedido");

export type EstadoPedidoDTO = z.infer<typeof esquemaEstadoPedido>;
