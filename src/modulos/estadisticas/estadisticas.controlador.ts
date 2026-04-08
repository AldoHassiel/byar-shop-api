import { respuestaError, respuestaOk } from "@/utilidades/respuesta.js";
import type { Request, Response } from "express";
import { ServicioEstadisticas } from "./estadisticas.servicio.js";

const obtenerEstadisticas = async (req: Request, res: Response) => {
  try {
    const datos = await ServicioEstadisticas.obtenerEstadisticas();
    return respuestaOk(res, "Estadisticas obtenidas con éxito", [datos]);
  } catch (error) {
    console.log(error);
    respuestaError(res, "Error interno del servidor");
  }
};

export const ControladorEstadisticas = {
  obtenerEstadisticas,
};
