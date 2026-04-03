import { z } from "zod";

export const esquemaEditarNegocio = z.object({
  nombre: z
    .string()
    .min(1, "El nombre no puede estar vacío")
    .max(50)
    .optional(),
  whatsapp: z.string().max(20).optional(),
  sobre_nosotros: z
    .string()
    .min(1, "Debe definirse la información del negocio")
    .max(500)
    .optional(),
  instagram: z.string().optional(),
  direccion: z
    .string()
    .min(1, "Debe definirse la dirección")
    .max(255)
    .optional(),
  dias_laborales: z
    .string()
    .min(1, "Debe definirse los dias laborales")
    .max(255)
    .optional(),
  hora_de_apertura: z
    .string()
    .min(1, "La hora de apertura no puede estar vacío")
    .regex(/^\d{2}:\d{2}(:\d{2})?$/, "Formato inválido (HH:MM)")
    .optional(),
  hora_de_cierre: z
    .string()
    .min(1, "La hora de cierre no puede estar vacío")
    .regex(/^\d{2}:\d{2}(:\d{2})?$/, "Formato inválido (HH:MM)")
    .optional(),
});

export type EditarNegocioBody = z.infer<typeof esquemaEditarNegocio>;

export type EditarNegocioServicio = EditarNegocioBody & {
  logotipo_url?: string | undefined;
  imagen_sobre_nosotros_url?: string | undefined;
  hero_imagen_url?: string | undefined;
};
