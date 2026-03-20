import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import z from "zod";

extendZodWithOpenApi(z);

export const esquemaEditarMisDatos = z
  .object({
    nombre: z.string().max(100).describe("Nombre del usuario"),
    apellidos: z.string().describe("Apellidos del usuario"),
    telefono: z.string().describe("Telefono del usuario"),
  })
  .openapi("MisDatos");

export const esquemaEditarCorreo = z
  .object({
    correo: z.string().describe("Correo nuevo del usuario"),
  })
  .openapi("EditarCorreo");

export const esquemaEditarPwd = z
  .object({
    pwd: z.string().describe("Contraseña nuevo del usuario"),
  })
  .openapi("EditarPwd");

export type MisDatosEditarDTO = z.infer<typeof esquemaEditarMisDatos>;
export type MisDatosEditarCorreoDTO = z.infer<typeof esquemaEditarCorreo>;
export type MisDatosEditarPwdDTO = z.infer<typeof esquemaEditarPwd>;
