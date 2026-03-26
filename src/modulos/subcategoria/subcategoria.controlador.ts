import type { Request, Response } from "express";
import {
  respuestaError,
  respuestaErrorValidacion,
  respuestaOk,
} from "@/utilidades/respuesta.js";
import { ServicioSubcategorias } from "./subcategoria.servicio.js";
import { esquemaSubcategoria } from "./subcategoria.esquema.js";

const obtenerSubcategorias = async (req: Request, res: Response) => {
  const es_admin = req.usuario?.es_admin;

  try {
    const categorias =
      await ServicioSubcategorias.obtenerSubcategorias(es_admin);
    return respuestaOk(res, "Subcategorías obtenidas con éxito", categorias);
  } catch (error) {
    console.log(error);
    return respuestaError(res, "Error interno del servidor");
  }
};

const obtenerSubcategoria = async (req: Request, res: Response) => {
  const es_admin = req.usuario?.es_admin;
  const { id } = req.params;

  try {
    const categoria = await ServicioSubcategorias.obtenerSubcategoria(
      Number(id),
      es_admin,
    );
    return respuestaOk(res, "Subcategoría obtenida con éxito", categoria);
  } catch (error) {
    console.log(error);
    return respuestaError(res, "Error interno del servidor");
  }
};

const crearSubcategoria = async (req: Request, res: Response) => {
  const categoria = esquemaSubcategoria.safeParse(req.body);

  if (!categoria.success) {
    return respuestaErrorValidacion(res, categoria.error);
  }

  try {
    await ServicioSubcategorias.crearSubcategoria(categoria.data);
    return respuestaOk(res, "Subategoria creada con éxito");
  } catch (error) {
    const mensaje = (error as Error).message;
    console.log(error);

    if (mensaje === "Ya existe esa subcategoría") {
      return respuestaError(res, mensaje, 409);
    }

    return respuestaError(res, "Error interno del servidor");
  }
};

const editarSubcategoria = async (req: Request, res: Response) => {
  const { id } = req.params;
  const categoria = esquemaSubcategoria.safeParse(req.body);

  if (!categoria.success) {
    return respuestaErrorValidacion(res, categoria.error);
  }

  try {
    await ServicioSubcategorias.editarSubcategoria(Number(id), categoria.data);
    return respuestaOk(res, "Subcategoria editada con éxito");
  } catch (error) {
    const mensaje = (error as Error).message;
    console.log(error);

    if (mensaje === "Ya existe una subcategoría con ese nombre") {
      return respuestaError(res, mensaje, 409);
    }

    return respuestaError(res, "Error interno del servidor");
  }
};

const eliminarSubcategoria = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await ServicioSubcategorias.eliminarSubcategoria(Number(id));
    return respuestaOk(res, "Subcategoría eliminado con éxito");
  } catch (error) {
    console.log(error);
    return respuestaError(res, "Error interno del servidor");
  }
};

const obtenerCategoriasConSubcategorias = async (
  req: Request,
  res: Response,
) => {
  try {
    const resultado =
      await ServicioSubcategorias.obtenerCategoriasConSubcategorias();

    return respuestaOk(
      res,
      "Categorías con subcategorías obtenidas con éxito",
      resultado,
    );
  } catch (error) {
    console.log(error);
    return respuestaError(res, "Error interno del servidor");
  }
};

export const ControladorSubcategoria = {
  obtenerSubcategorias,
  obtenerSubcategoria,
  crearSubcategoria,
  editarSubcategoria,
  eliminarSubcategoria,
  obtenerCategoriasConSubcategorias,
};
