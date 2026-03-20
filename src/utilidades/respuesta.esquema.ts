import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import z from "zod";

extendZodWithOpenApi(z);

/**
 * Esquemas de respuesta genéricos de la API
 * Toda respuesta de la API sigue estas estructuras
 */

// Respuesta exitosa genérica
export const esquemaRespuestaExitosa = z
  .object({
    estado: z.boolean().describe("Indica que la respuesta fue exitosa (true)"),
    mensaje: z
      .string()
      .describe(
        "Mensaje descriptivo de la operación realizada (ej: 'Usuarios obtenidos con éxito')",
      ),
    datos: z
      .any()
      .nullable()
      .describe(
        "Datos devueltos por el endpoint. Puede ser un objeto, array, o nulo dependiendo de la operación",
      ),
  })
  .openapi("RespuestaExitosa");

// Respuesta de error genérica
export const esquemaRespuestaError = z
  .object({
    estado: z.boolean().describe("Indica que hubo un error (false)"),
    mensaje: z
      .string()
      .describe(
        "Mensaje descriptivo del error (ej: 'No autorizado' o 'Datos inválidos')",
      ),
    datos: z.null().describe("Siempre null en respuestas de error"),
  })
  .openapi("RespuestaError");

// Respuesta de error de validación
export const esquemaRespuestaErrorValidacion = z
  .object({
    estado: z.boolean().describe("Indica error de validación (false)"),
    mensaje: z
      .string()
      .describe(
        "Siempre es 'Error de validaciones' para este tipo de respuesta",
      ),
    datos: z
      .array(
        z.object({
          campo: z
            .string()
            .describe("Ruta del campo que tiene error (ej: 'correo', 'pwd')"),
          mensaje: z
            .string()
            .describe(
              "Descripción del error en ese campo (ej: 'El correo no tiene un formato válido')",
            ),
        }),
      )
      .describe("Array de errores de validación con detalle por campo"),
  })
  .openapi("RespuestaErrorValidacion");

export type RespuestaExitosaDTO = z.infer<typeof esquemaRespuestaExitosa>;
export type RespuestaErrorDTO = z.infer<typeof esquemaRespuestaError>;
export type RespuestaErrorValidacionDTO = z.infer<
  typeof esquemaRespuestaErrorValidacion
>;
