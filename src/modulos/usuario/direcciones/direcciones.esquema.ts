import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import z from "zod";

extendZodWithOpenApi(z);

export const esquemaDireccones = z
  .object({
    calle: z
      .string()
      .max(150)
      .describe("Nombre de la calle o avenida. Máximo 150 caracteres"),
    numero_exterior: z
      .string()
      .max(20)
      .describe("Número exterior del domicilio. Máximo 20 caracteres"),
    numero_interior: z
      .string()
      .max(20)
      .describe(
        "Número interior, departamento o apartado (si aplica). Máximo 20 caracteres",
      ),
    colonia: z
      .string()
      .max(100)
      .describe("Nombre de la colonia o barrio. Máximo 100 caracteres"),
    ciudad: z
      .string()
      .max(100)
      .describe("Ciudad del domicilio. Máximo 100 caracteres"),
    municipio: z
      .string()
      .max(100)
      .describe("Municipio o delegación. Máximo 100 caracteres"),
    estado: z
      .string()
      .max(100)
      .describe("Estado o provincia. Máximo 100 caracteres"),
    codigo_postal: z
      .string()
      .max(10)
      .describe("Código postal del domicilio. Máximo 10 caracteres"),
    especificaciones: z
      .string()
      .max(255)
      .describe(
        "Indicaciones adicionales o referencias del lugar (ej: cerca del mercado). Máximo 255 caracteres",
      ),
  })
  .openapi("Direccion");

export type DireccionDTO = z.infer<typeof esquemaDireccones>;
