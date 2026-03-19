import z from "zod";

export const esquemaMetodosPago = z.object({
  nombre_titular: z.string().min(3).max(255),
  numero_tarjeta: z.string().min(13).max(50),
  mes_vencimiento: z.string().min(2).max(2),
  ano_vencimiento: z.string().min(4).max(4),
  cvv: z.string().min(3).max(5),
  marca: z.string().max(255),
});

export type MetodoPagoDTO = z.infer<typeof esquemaMetodosPago>;
