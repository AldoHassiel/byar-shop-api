import type { Request, Response } from "express";
import {
  respuestaError,
  respuestaErrorValidacion,
  respuestaOk,
} from "@/utilidades/respuesta.js";
import { ServicioCategorias } from "./categoria.servicio.js";
import { esquemaCategoria } from "./categoria.esquema.js";

const obtenerCategorias = async (req: Request, res: Response) => {
  const es_admin = req.usuario?.es_admin;

  try {
    const categorias = await ServicioCategorias.obtenerCategorias(es_admin);
    return respuestaOk(res, "Categorías obtenidas con éxito", categorias);
  } catch (error) {
    console.log(error);
    return respuestaError(res, "Error interno del servidor");
  }
};

const obtenerCategoria = async (req: Request, res: Response) => {
  const es_admin = req.usuario?.es_admin;
  const { id } = req.params;

  try {
    const categoria = await ServicioCategorias.obtenerCategoria(
      Number(id),
      es_admin,
    );
    return respuestaOk(res, "Categoría obtenida con éxito", categoria);
  } catch (error) {
    console.log(error);
    return respuestaError(res, "Error interno del servidor");
  }
};

const crearCategoria = async (req: Request, res: Response) => {
  const categoria = esquemaCategoria.safeParse(req.body);

  if (!categoria.success) {
    return respuestaErrorValidacion(res, categoria.error);
  }

  try {
    await ServicioCategorias.crearCategoria(categoria.data);
    return respuestaOk(res, "Categoria creada con éxito");
  } catch (error) {
    const mensaje = (error as Error).message;
    console.log(error);

    if (mensaje === "Ya existe esa categoría") {
      return respuestaError(res, mensaje, 409);
    }

    return respuestaError(res, "Error interno del servidor");
  }
};

const editarCategoria = async (req: Request, res: Response) => {
  const { id } = req.params;
  const categoria = esquemaCategoria.safeParse(req.body);

  if (!categoria.success) {
    return respuestaErrorValidacion(res, categoria.error);
  }

  try {
    await ServicioCategorias.editarCategoria(Number(id), categoria.data);
    return respuestaOk(res, "Categoria editada con éxito");
  } catch (error) {
    const mensaje = (error as Error).message;
    console.log(error);

    if (mensaje === "Ya existe una categoría con ese nombre") {
      return respuestaError(res, mensaje, 409);
    }

    return respuestaError(res, "Error interno del servidor");
  }
};

const eliminarCategoria = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await ServicioCategorias.eliminarCategoria(Number(id));
    return respuestaOk(res, "Categoría eliminado con éxito");
  } catch (error) {
    console.log(error);
    return respuestaError(res, "Error interno del servidor");
  }
};

export const ControladorCategoria = {
  obtenerCategorias,
  obtenerCategoria,
  crearCategoria,
  editarCategoria,
  eliminarCategoria,
};
