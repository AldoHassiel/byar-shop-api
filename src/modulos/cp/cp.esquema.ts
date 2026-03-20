import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import z from "zod";

extendZodWithOpenApi(z);

export const esquemaCP = z
  .object({
    colonia: z
      .string()
      .describe("Nombre de la colonia o asentamiento para ese código postal"),
    municipio: z
      .string()
      .describe("Municipio correspondiente al código postal"),
    estado: z.string().describe("Estado o entidad federativa"),
    ciudad: z.string().describe("Ciudad relacionada al código postal"),
  })
  .openapi("CodigoPostal");

export type CPDTO = z.infer<typeof esquemaCP>;
