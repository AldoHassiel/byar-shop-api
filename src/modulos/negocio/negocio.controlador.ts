import type { Request, Response } from "express";
import { ServicioNegocio } from "./negocio.servicio.js";
import {
  respuestaError,
  respuestaErrorValidacion,
  respuestaOk,
} from "@/utilidades/respuesta.js";
import { eliminarImagen, subirImagen } from "@/supabase/supabase.js";
import { esquemaEditarNegocio } from "./negocio.esquema.js";

const obtenerNegocio = async (req: Request, res: Response) => {
  try {
    const negocio = await ServicioNegocio.obtenerNegocio();

    if (negocio.length === 0) {
      return respuestaError(res, "No se encontró información del negocio", 404);
    }

    return respuestaOk(res, "Negocio obtenido con éxito", negocio);
  } catch (error) {
    console.log(error);
    return respuestaError(res, "Error interno del servidor");
  }
};

const editarNegocio = async (req: Request, res: Response) => {
  const negocio = esquemaEditarNegocio.safeParse(req.body);

  if (!negocio.success) {
    return respuestaErrorValidacion(res, negocio.error);
  }

  const archivos = req.files as { [fieldname: string]: Express.Multer.File[] };

  try {
    const negocioPeticion = await ServicioNegocio.obtenerNegocio();

    if (!negocioPeticion) {
      return respuestaError(res, "Negocio no encontrado", 404);
    }

    const negocioDatos = negocioPeticion[0];

    let logotipo_url: string | undefined;

    if (archivos?.logotipo?.[0]) {
      if (negocioDatos.logotipo_url) {
        await eliminarImagen(negocioDatos.logotipo_url);
      }

      logotipo_url = await subirImagen(archivos.logotipo[0], "negocio");
    }

    let imagen_sobre_nosotros_url: string | undefined;
    if (archivos?.imagen_sobre_nosotros?.[0]) {
      if (negocioDatos.imagen_sobre_nosotros_url) {
        await eliminarImagen(negocioDatos.imagen_sobre_nosotros_url);
      }

      imagen_sobre_nosotros_url = await subirImagen(
        archivos.imagen_sobre_nosotros[0],
        "negocio",
      );
    }

    let hero_imagen_url: string | undefined;
    if (archivos?.hero_imagen?.[0]) {
      if (negocioDatos.hero_imagen_url) {
        await eliminarImagen(negocioDatos.hero_imagen_url);
      }

      hero_imagen_url = await subirImagen(archivos.hero_imagen[0], "negocio");
    }

    await ServicioNegocio.editarNegocio({
      ...negocio.data,
      logotipo_url,
      imagen_sobre_nosotros_url,
      hero_imagen_url,
    });

    return respuestaOk(res, "Negocio editado con éxito");
  } catch (error) {
    console.log(error);
    return respuestaError(res, "Error interno del servidor");
  }
};

export const ControladorNegocio = {
  obtenerNegocio,
  editarNegocio,
};
