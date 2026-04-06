import {
  respuestaError,
  respuestaErrorValidacion,
  respuestaOk,
} from "@/utilidades/respuesta.js";
import type { Request, Response } from "express";
import { ServicioCompras } from "./compras.servicio.js";
import { esquemaCompra } from "./compras.esquema.js";

const obtenerCompras = async (req: Request, res: Response) => {
  if (!req.usuario?.id) {
    return respuestaError(res, "Hace falta el id en el token", 400);
  }

  try {
    const compras = await ServicioCompras.obtenerCompras(req.usuario?.id);
    return respuestaOk(res, "Compras obtenidas con éxito", compras);
  } catch (error) {
    console.log(error);
    return respuestaError(res, "Error interno del servidor");
  }
};

const obtenerDetalleCompra = async (req: Request, res: Response) => {
  if (!req.usuario?.id) {
    return respuestaError(res, "Hace falta el id en el token", 400);
  }

  const { id } = req.params;

  if (!id) {
    return respuestaError(res, "Falta el id", 400);
  }

  if (isNaN(Number(id))) {
    return respuestaError(res, "El id debe de ser un número", 400);
  }

  try {
    const detalle = await ServicioCompras.obtenerDetalleCompra(
      req.usuario?.id,
      Number(id),
    );
    return respuestaOk(res, "El detalle de la compra se obtuvo con éxito", [
      detalle,
    ]);
  } catch (error) {
    console.log(error);
    return respuestaError(res, "Error interno del servidor");
  }
};

const realizarCompra = async (req: Request, res: Response) => {
  if (!req.usuario?.id) {
    return respuestaError(res, "Hace falta el id en el token", 400);
  }

  const datos = esquemaCompra.safeParse(req.body);

  if (!datos.success) {
    return respuestaErrorValidacion(res, datos.error);
  }

  try {
    await ServicioCompras.realizarCompra(req.usuario?.id, datos.data);
    return respuestaOk(res, "Compra realizada con éxito", []);
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      const esConflicto = error.message.includes("Stock insuficiente");
      return respuestaError(res, error.message, esConflicto ? 409 : 400);
    }
    return respuestaError(res, "Error interno del servidor");
  }
};

export const ControladorCompras = {
  obtenerCompras,
  obtenerDetalleCompra,
  realizarCompra,
};
