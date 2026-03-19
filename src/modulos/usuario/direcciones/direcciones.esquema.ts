import z from "zod";

export const esquemaDireccones = z.object({
  calle: z.string().max(150),
  numero_exterior: z.string().max(20),
  numero_interior: z.string().max(20),
  colonia: z.string().max(100),
  ciudad: z.string().max(100),
  municipio: z.string().max(100),
  estado: z.string().max(100),
  codigo_postal: z.string().max(10),
  especificaciones: z.string().max(255),
});

export type DireccionDTO = z.infer<typeof esquemaDireccones>;
