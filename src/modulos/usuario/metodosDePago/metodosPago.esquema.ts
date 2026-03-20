import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import z from "zod";

extendZodWithOpenApi(z);

export const esquemaMetodosPago = z
  .object({
    nombre_titular: z
      .string()
      .min(3)
      .max(255)
      .describe(
        "Nombre completo del titular de la tarjeta. Entre 3 y 255 caracteres",
      ),
    numero_tarjeta: z
      .string()
      .min(13)
      .max(50)
      .describe(
        "Número de la tarjeta de crédito/débito (sin espacios). Entre 13 y 50 dígitos",
      ),
    mes_vencimiento: z
      .string()
      .min(2)
      .max(2)
      .describe("Mes de vencimiento de la tarjeta en formato MM (01-12)"),
    ano_vencimiento: z
      .string()
      .min(4)
      .max(4)
      .describe("Año de vencimiento de la tarjeta en formato YYYY (ej: 2025)"),
    cvv: z
      .string()
      .min(3)
      .max(5)
      .describe(
        "Código de verificación (CVV) de la tarjeta. Generalmente 3 dígitos",
      ),
    marca: z
      .string()
      .max(255)
      .describe(
        "Marca de la tarjeta (Visa, Mastercard, Amex, etc). Máximo 255 caracteres",
      ),
  })
  .openapi("MetodoPago");

export type MetodoPagoDTO = z.infer<typeof esquemaMetodosPago>;
