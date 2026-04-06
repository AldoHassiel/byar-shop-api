import { respuestaError, respuestaOk } from "@/utilidades/respuesta.js";
import type { Request, Response } from "express";
import { ServicioCompras } from "./compras.servicio.js";

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

export const ControladorCompras = {
  obtenerCompras,
  obtenerDetalleCompra,
};
