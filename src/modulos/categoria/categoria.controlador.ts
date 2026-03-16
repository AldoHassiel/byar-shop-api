import type { Request, Response } from "express";
import { respuestaError, respuestaOk } from "@/utilidades/respuesta.js";
import { ServicioCategorias } from "./categoria.servicio.js";

const obtenerCategorias = async (req: Request, res: Response) => {
  const es_admin = req.usuario?.es_admin
  
  try {
    const categorias = await ServicioCategorias.obtenerCategorias(es_admin);
    return res.status(200).json(respuestaOk("Todo bien", categorias));
  } catch (error) {
    console.log(error);
    res.status(500).json(respuestaError("Error interno del servidor", error));
  }
};

export const ControladorCategoria = {
  obtenerCategorias,
};
