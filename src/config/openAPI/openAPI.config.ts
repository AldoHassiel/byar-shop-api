import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registro } from "./openAPI.registro.js";

export function generarDocumentacion() {
  const generador = new OpenApiGeneratorV3(registro.definitions);

  return generador.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "API de ByarShop",
      version: "1.0.0",
      description: "Documentación oficial de la API de ByarShop",
    },
    servers: [{ url: "/" }],
  });
}
