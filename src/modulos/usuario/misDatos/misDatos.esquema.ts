import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import z from "zod";

extendZodWithOpenApi(z);

export const esquemaEditarMisDatos = z
  .object({
    nombre: z.string().max(100).describe("Nombre del usuario"),
    apellidos: z.string().describe("Apellidos del usuario"),
    telefono: z.string().describe("Telefono del usuario").optional(),
  })
  .openapi("MisDatos");

export const esquemaEditarCorreo = z
  .object({
    correo: z.string().email().describe("Correo nuevo del usuario"),
    pwd_actual: z
      .string()
      .min(8, "La contraseña actual debe tener al menos 8 caracteres")
      .describe("Contraseña actual del usuario"),
  })
  .openapi("EditarCorreo");

export const esquemaEditarPwd = z
  .object({
    pwd_actual: z
      .string()
      .min(8, "La contraseña actual debe tener al menos 8 caracteres")
      .describe("Contraseña antigua del usuario"),
    pwd_nuevo: z
      .string()
      .min(8, "La nueva contraseña debe tener al menos 8 caracteres")
      .describe("Contraseña nueva del usuario"),
  })
  .openapi("EditarPwd");

export type MisDatosEditarDTO = z.infer<typeof esquemaEditarMisDatos>;
export type MisDatosEditarCorreoDTO = z.infer<typeof esquemaEditarCorreo>;
export type MisDatosEditarPwdDTO = z.infer<typeof esquemaEditarPwd>;
