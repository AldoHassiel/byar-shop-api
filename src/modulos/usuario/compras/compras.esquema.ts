import z from "zod";

export const esquemaCompra = z.object({
  id_direccion: z.coerce.number(),
  id_tarjeta: z.coerce.number(),
});

export type CompraDTO = z.infer<typeof esquemaCompra>; 
