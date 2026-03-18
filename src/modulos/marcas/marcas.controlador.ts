import type { Request, Response } from "express";
import {
  respuestaError,
  respuestaErrorValidacion,
  respuestaOk,
} from "@/utilidades/respuesta.js";
import { ServicioMarcas } from "./marcas.servicio.js";
import { esquemaMarca } from "./marcas.esquema.js";

const obtenerMarcas = async (req: Request, res: Response) => {
  const es_admin = req.usuario?.es_admin;

  try {
    const marcas = await ServicioMarcas.obtenerMarcas(es_admin);
    return respuestaOk(res, "Marcas obtenidas con éxito", marcas);
  } catch (error) {
    console.log(error);
    return respuestaError(res, "Error interno del servidor");
  }
};

const obtenerMarca = async (req: Request, res: Response) => {
  const es_admin = req.usuario?.es_admin;
  const { id } = req.params;

  if (!id) {
    return respuestaError(res, "Falta el id", 400);
  }

  if (isNaN(Number(id))) {
    return respuestaError(res, "El id debe de ser un número", 400);
  }

  try {
    const marcas = await ServicioMarcas.obtenerMarca(Number(id), es_admin);
    return respuestaOk(res, "Marca obtenida con éxito", marcas);
  } catch (error) {
    console.log(error);
    return respuestaError(res, "Error interno del servidor");
  }
};

const crearMarca = async (req: Request, res: Response) => {
  const marca = esquemaMarca.safeParse(req.body);

  if (!marca.success) {
    return respuestaErrorValidacion(res, marca.error);
  }

  try {
    await ServicioMarcas.crearMarca(marca.data);
    return respuestaOk(res, "Marca creada con éxito");
  } catch (error) {
    const mensaje = (error as Error).message;
    console.log(error);

    if (mensaje === "Ya existe esa marca") {
      return respuestaError(res, mensaje, 409);
    }

    return respuestaError(res, "Error interno del servidor");
  }
};

const editarMarca = async (req: Request, res: Response) => {
  const marca = esquemaMarca.safeParse(req.body);
  const { id } = req.params;

  if (!marca.success) {
    return respuestaErrorValidacion(res, marca.error);
  }

  if (!id) {
    return respuestaError(res, "Falta el id", 400);
  }

  if (isNaN(Number(id))) {
    return respuestaError(res, "El id debe de ser un número", 400);
  }

  try {
    await ServicioMarcas.editarMarca(Number(id), marca.data);
    return respuestaOk(res, "Marca editada con éxito");
  } catch (error) {
    const mensaje = (error as Error).message;
    console.log(error);

    if (mensaje === "Ya existe esa marca") {
      return respuestaError(res, mensaje, 409);
    }

    return respuestaError(res, "Error interno del servidor");
  }
};

const eliminarMarca = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return respuestaError(res, "Falta el id", 400);
  }

  if (isNaN(Number(id))) {
    return respuestaError(res, "El id debe de ser un número", 400);
  }

  try {
    await ServicioMarcas.eliminarMarca(Number(id));
    return respuestaOk(res, "Marca eliminado con éxito");
  } catch (error) {
    console.log(error);
    return respuestaError(res, "Error interno del servidor");
  }
};

export const ControladorMarcas = {
  obtenerMarcas,
  obtenerMarca,
  crearMarca,
  editarMarca,
  eliminarMarca,
};
