import z from "zod";

export const esquemaCarritoObtener = z.object({
  id_direccion: z.coerce.number().nullable().default(null),
});

export const esquemaCarritoAgregar = z.object({
  id_producto: z.coerce.number(),
  cantidad: z.coerce.number(),
});

export const esquemaCarritoActualizar = z.object({
  delta: z.coerce.number(),
});
