import { z } from "zod";

export const esquemaNegocio = z
    .object({
        nombre: z
            .string()
            .describe("Nombre del negocio o tienda"),

        descripcion: z
            .string()
            .optional()
            .describe("Descripción general del negocio"),

        imagen_url: z
            .string()
            .optional()
            .describe("URL de la imagen principal del negocio"),

        instagram: z
            .string()
            .optional()
            .describe("Usuario o enlace de Instagram del negocio"),

        direccion: z
            .string()
            .optional()
            .describe("Dirección física del negocio"),

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

        titulo_hero: z
            .string()
            .optional()
            .describe("Título principal mostrado en la sección hero del sitio"),

        hero: z
            .string()
            .optional()
            .describe("Texto o contenido destacado en la sección principal (hero)"),
    })
    .openapi("Negocio");