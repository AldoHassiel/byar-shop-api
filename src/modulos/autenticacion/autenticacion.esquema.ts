import z from "zod";

export const esquemaRegistro = z.object({
  nombre: z
    .string()
    .trim()
    .min(3, "El nombre debe de tener mínimo 3 caracteres")
    .max(100, "El nombre no puede exceder de 100 caracteres"),
  apellidos: z
    .string()
    .trim()
    .min(3, "Los apellidos deben de tener mínimo 3 caracteres")
    .max(100, "Los apellidos  no puede exceder de 100 caracteres")
    .optional(),
  telefono: z
    .string()
    .trim()
    .min(10, "El número de teléfono debe de tener al menos 10 dígitos")
    .max(20, "El teléfono no puede exceder 20 dígitos")
    .optional(),
  correo: z.email("El correo no tiene un formato válido"),
  pwd: z
    .string()
    .min(8, "La contraseña debe de ser de minimamente de 8 caracteres"),
});

export const esquemaInicioSesion = z.object({
  correo: z.email("El correo no tiene un formato válido"),
  pwd: z
    .string()
    .min(8, "La contraseña debe de ser de minimamente de 8 caracteres"),
});

export type RegistroDTO = z.infer<typeof esquemaRegistro>;
export type InicioSesionDTO = z.infer<typeof esquemaInicioSesion>;
