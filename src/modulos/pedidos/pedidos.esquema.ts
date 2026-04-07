import z from "zod";

export const esquemaFiltrosPedidos = z.object({
  id_pedido: z.coerce.number().optional(),
  nombre_usuario: z.coerce.string().optional(),
  direccion: z.coerce.string().optional(),
  id_estado: z.coerce.number().optional(),
  fecha_inicio: z.coerce.string().optional(),
  fecha_fin: z.coerce.string().optional(),
  periodo_dias: z.coerce.string().optional(),
});

export type FiltrosPedidoDTO = z.infer<typeof esquemaFiltrosPedidos>;