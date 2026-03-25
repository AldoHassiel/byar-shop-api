import { z } from "zod";

export const esquemaNegocio = z
  .object({
    nombre: z.string().describe("Nombre del negocio o tienda"),

    descripcion: z
      .string()
      .optional()
      .describe("Descripción general del negocio"),

    sobre_de: z.string().optional().describe("Descripción general del negocio"),

    imagen_sobre_de_url: z
      .string()
      .optional()
      .describe("URL de la imagen principal del negocio"),

    instagram: z
      .string()
      .optional()
      .describe("Usuario o enlace de Instagram del negocio"),

    direccion: z.string().optional().describe("Dirección física del negocio"),

    dias_laborales: z
      .string()
      .optional()
      .describe("Días en los que opera el negocio. Ejemplo: Lunes a Viernes"),

    hora_de_apertura: z
      .string()
      .optional()
      .describe("Hora de apertura del negocio en formato HH:mm"),

    hora_de_cierre: z
      .string()
      .optional()
      .describe("Hora de cierre del negocio en formato HH:mm"),

    hero_titulo: z
      .string()
      .optional()
      .describe("Título principal mostrado en la sección hero del sitio"),

    hero_descripcion: z
      .string()
      .optional()
      .describe("Texto o contenido destacado en la sección principal (hero)"),

    hero_imagen_url: z
      .string()
      .optional()
      .describe("Texto o contenido destacado en la sección principal (hero)"),

    accion_imagen_sobre_de: z
      .enum(["conservar", "nueva", "eliminar"])
      .describe(
        "Acción a realizar con la imagen: conservar la actual, subir una nueva, o eliminarla",
      ),

    accion_imagen_hero: z
      .enum(["conservar", "nueva", "eliminar"])
      .describe(
        "Acción a realizar con la imagen: conservar la actual, subir una nueva, o eliminarla",
      ),
  })
  .openapi("Negocio");

export type NegocioDTO = z.infer<typeof esquemaNegocio>;
