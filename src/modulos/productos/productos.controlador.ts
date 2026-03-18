import type { Request, Response } from "express";
import {
  esquemaFiltrosProducto,
  esquemaProducto,
} from "./productos.esquema.js";
import { ServicioProductos } from "./productos.servicio.js";
import {
  respuestaAPI,
  respuestaError,
  respuestaErrorValidacion,
  respuestaOk,
} from "@/utilidades/respuesta.js";

const obtenerProductos = async (req: Request, res: Response) => {
  const parametros = esquemaFiltrosProducto.safeParse(req.query);

  if (!parametros.success) {
    return respuestaErrorValidacion(res, parametros.error);
  }

  if (!parametros.data.limite) {
    parametros.data.limite = 20;
  }

  try {
    const productos = await ServicioProductos.obtenerProductos(parametros.data);
    const total =
      productos.length > 0 ? parseInt(productos[0].total_registros) : 0;
    const total_paginas = Math.ceil(total / parametros.data.limite);

    return respuestaAPI(res, "Productos obtenidos con éxito", {
      total_paginas,
      productos,
    });
  } catch (error) {
    console.log(error);
    return respuestaError(res, "Error interno del servidor");
  }
};

const obtenerProducto = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return respuestaError(res, "Falta el id", 400);
  }

  if (isNaN(Number(id))) {
    return respuestaError(res, "El id debe de ser un número", 400);
  }

  try {
    const producto = await ServicioProductos.obtenerProducto(Number(id));
    return respuestaOk(res, "Producto obtenida con éxito", producto);
  } catch (error) {
    console.log(error);
    return respuestaError(res, "Error interno del servidor");
  }
};

const crearProducto = async (req: Request, res: Response) => {
  const producto = esquemaProducto.safeParse(req.body);

  if (!producto.success) {
    return respuestaErrorValidacion(res, producto.error);
  }

  try {
    await ServicioProductos.crearProducto(producto.data);
    return respuestaOk(res, "Producto creado con éxito");
  } catch (error) {
    const mensaje = (error as Error).message;
    console.log(error);

    if (mensaje === "Ya existe ese producto") {
      return respuestaError(res, mensaje, 409);
    }

    return respuestaError(res, "Error interno del servidor");
  }
};

const editarProducto = async (req: Request, res: Response) => {
  const producto = esquemaProducto.safeParse(req.body);
  const { id } = req.params;

  if (!producto.success) {
    return respuestaErrorValidacion(res, producto.error);
  }

  if (!id) {
    return respuestaError(res, "Falta el id", 400);
  }

  if (isNaN(Number(id))) {
    return respuestaError(res, "El id debe de ser un número", 400);
  }

  try {
    await ServicioProductos.editarProducto(Number(id), producto.data);
    return respuestaOk(res, "Producto editado con éxito");
  } catch (error) {
    const mensaje = (error as Error).message;
    console.log(error);

    if (mensaje === "Ya existe ese producto") {
      return respuestaError(res, mensaje, 409);
    }

    return respuestaError(res, "Error interno del servidor");
  }
};

const eliminarProducto = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return respuestaError(res, "Falta el id", 400);
  }

  if (isNaN(Number(id))) {
    return respuestaError(res, "El id debe de ser un número", 400);
  }

  try {
    await ServicioProductos.eliminarProducto(Number(id));
    return respuestaOk(res, "Producto eliminado con éxito");
  } catch (error) {
    console.log(error);
    return respuestaError(res, "Error interno del servidor");
  }
};

export const ControladorProductos = {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  editarProducto,
  eliminarProducto,
};
