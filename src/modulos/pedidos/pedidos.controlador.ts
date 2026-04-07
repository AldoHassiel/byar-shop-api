import type { Request, Response } from "express";
import { esquemaFiltrosPedidos } from "./pedidos.esquema.js";
import {
  respuestaError,
  respuestaErrorValidacion,
  respuestaOk,
} from "@/utilidades/respuesta.js";
import { ServicioPedidos } from "./pedidos.servicio.js";

const obtenerPedidos = async (req: Request, res: Response) => {
  const filtros = esquemaFiltrosPedidos.safeParse(req.query);

  if (!filtros.success) {
    return respuestaErrorValidacion(res, filtros.error);
  }

  try {
    const pedidos = await ServicioPedidos.obtenerPedidos(filtros.data);
    return respuestaOk(res, "Pedidos obtenidos con éxito", pedidos);
  } catch (error) {
    console.log(error);
    return respuestaError(res, "Error interno del servidor");
  }
};

const obtenerPedido = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return respuestaError(res, "El id debe ser un número válido", 400);
  }

  try {
    const pedido = await ServicioPedidos.obtenerPedido(Number(id));
    return respuestaOk(res, "Pedido obtenido con éxito", [pedido]);
  } catch (error) {
    console.log(error);
    return respuestaError(res, "Error interno del servidor");
  }
};

const cambiarEstado = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return respuestaError(res, "El id debe ser un número válido", 400);
  }

  const { id_estado } = req.body;

  if (!id_estado || isNaN(Number(id_estado))) {
    return respuestaError(res, "No existe ese id del estado", 400);
  }

  try {
    await ServicioPedidos.cambiarEstado(Number(id), Number(id_estado));
    return respuestaOk(res, "Pedido actualiado con éxito", []);
  } catch (error) {
    console.log(error);
    return respuestaError(res, "Error interno del servidor");
  }
};

export const ControladorPedidos = {
  obtenerPedidos,
  obtenerPedido,
  cambiarEstado,
};
