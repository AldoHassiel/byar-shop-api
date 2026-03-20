import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import z from "zod";

extendZodWithOpenApi(z);

export const esquemaRegistro = z
  .object({
    nombre: z
      .string()
      .trim()
      .min(3, "El nombre debe de tener mínimo 3 caracteres")
      .max(100, "El nombre no puede exceder de 100 caracteres")
      .describe(
        "Nombre completo del usuario. Debe tener entre 3 y 100 caracteres",
      ),
    apellidos: z
      .string()
      .trim()
      .min(3, "Los apellidos deben de tener mínimo 3 caracteres")
      .max(100, "Los apellidos  no puede exceder de 100 caracteres")
      .optional()
      .describe("Apellidos del usuario (opcional). Entre 3 y 100 caracteres"),
    telefono: z
      .string()
      .trim()
      .min(10, "El número de teléfono debe de tener al menos 10 dígitos")
      .max(20, "El teléfono no puede exceder 20 dígitos")
      .optional()
      .describe(
        "Número de teléfono de contacto (opcional). Entre 10 y 20 dígitos",
      ),
    correo: z
      .email("El correo no tiene un formato válido")
      .describe("Correo electrónico único. Debe ser un email válido"),
    pwd: z
      .string()
      .min(8, "La contraseña debe de ser de minimamente de 8 caracteres")
      .describe("Contraseña de acceso. Mínimo 8 caracteres"),
  })
  .openapi("Registro");

export const esquemaInicioSesion = z
  .object({
    correo: z
      .email("El correo no tiene un formato válido")
      .describe("Correo electrónico registrado en el sistema"),
    pwd: z
      .string()
      .min(8, "La contraseña debe de ser de minimamente de 8 caracteres")
      .describe("Contraseña asociada a la cuenta"),
  })
  .openapi("InicioSesion");

export type RegistroDTO = z.infer<typeof esquemaRegistro>;
export type InicioSesionDTO = z.infer<typeof esquemaInicioSesion>;
