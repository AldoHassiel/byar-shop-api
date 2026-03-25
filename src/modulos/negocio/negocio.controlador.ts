import type { Request, Response } from "express";
import { ServicioNegocio } from "./negocio.servicio.js";
import {
  respuestaError,
  respuestaErrorValidacion,
  respuestaOk,
} from "@/utilidades/respuesta.js";
import { esquemaNegocio } from "./negocio.esquema.js";
import { subirImagen } from "@/supabase/supabase.js";

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
  const negocio = esquemaNegocio.safeParse(req.body);
  if (!negocio.success) {
    return respuestaErrorValidacion(res, negocio.error);
  }

  const files = req.files as {
    imagen_sobre_de?: Express.Multer.File[];
    imagen_hero?: Express.Multer.File[];
  };

  const archivoSobreDe = files?.imagen_sobre_de?.[0];
  const archivoHero = files?.imagen_hero?.[0];

  if (negocio.data.accion_imagen_sobre_de === "nueva" && !archivoSobreDe) {
    return respuestaError(res, "Se esperaba una imagen para 'sobre de'", 400);
  }
  if (negocio.data.accion_imagen_hero === "nueva" && !archivoHero) {
    return respuestaError(res, "Se esperaba una imagen para el hero", 400);
  }

  try {
    let imagenSobreDeUrl: string | undefined = undefined;
    if (negocio.data.accion_imagen_sobre_de === "nueva" && archivoSobreDe) {
      imagenSobreDeUrl = await subirImagen(archivoSobreDe, "negocio");
    }

    let imagenHeroUrl: string | undefined = undefined;
    if (negocio.data.accion_imagen_hero === "nueva" && archivoHero) {
      imagenHeroUrl = await subirImagen(archivoHero, "negocio");
    }

    await ServicioNegocio.editarNegocio({
      ...negocio.data,
      imagen_sobre_de_url: imagenSobreDeUrl,
      hero_imagen_url: imagenHeroUrl,
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
