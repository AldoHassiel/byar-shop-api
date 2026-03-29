import {
  respuestaError,
  respuestaErrorValidacion,
  respuestaOk,
} from "@/utilidades/respuesta.js";
import type { Request, Response } from "express";
import { ServicioCarrito } from "./carrito.servicio.js";
import {
  esquemaCarritoActualizar,
  esquemaCarritoAgregar,
  esquemaCarritoObtener,
} from "./carrito.esquema.js";

const obtenerCarrito = async (req: Request, res: Response) => {
  if (!req.usuario?.id) {
    return respuestaError(res, "Hace falta el id en el token", 400);
  }

  const parametro = esquemaCarritoObtener.safeParse(req.query);
  if (!parametro.success) {
    return respuestaErrorValidacion(res, parametro.error);
  }

  try {
    const datos = await ServicioCarrito.obtenerCarrito(
      req.usuario?.id,
      parametro.data.id_direccion,
    );

    return respuestaOk(res, "Carrito obtenido con éxito", [datos]);
  } catch (error) {
    console.error(error);
    return respuestaError(res, "Error interno del servidor");
  }
};

const agregarProducto = async (req: Request, res: Response) => {
  if (!req.usuario?.id) {
    return respuestaError(res, "Hace falta el id en el token", 400);
  }

  const datos = esquemaCarritoAgregar.safeParse(req.body);
  if (!datos.success) {
    return respuestaErrorValidacion(res, datos.error);
  }

  try {
    const { mensaje } = await ServicioCarrito.agregarProducto(
      req.usuario?.id,
      datos.data.id_producto,
      datos.data.cantidad,
    );

    return respuestaOk(res, mensaje);
  } catch (error) {
    console.error(error);
    const mensaje = (error as Error).message;

    if (
      mensaje === "El producto no existe" ||
      mensaje === "Stock insuficiente"
    ) {
      return respuestaError(res, mensaje, 400);
    }

    return respuestaError(res, "Error interno del servidor");
  }
};

const actualizarProducto = async (req: Request, res: Response) => {
  if (!req.usuario?.id) {
    return respuestaError(res, "Hace falta el id en el token", 400);
  }

  const { productoId } = req.params;

  if (!productoId) {
    return respuestaError(res, "Falta el id del producto", 400);
  }

  if (isNaN(Number(productoId))) {
    return respuestaError(res, "El id del producto debe de ser un número", 400);
  }

  const datos = esquemaCarritoActualizar.safeParse(req.body);
  if (!datos.success) {
    return respuestaErrorValidacion(res, datos.error);
  }

  try {
    await ServicioCarrito.actualizarProducto(
      req.usuario?.id,
      Number(productoId),
      datos.data.delta,
    );

    return respuestaOk(res, "Cantidad actualizada con éxito");
  } catch (error) {
    console.error(error);
    const mensaje = (error as Error).message;

    if (mensaje === "Stock insuficiente") {
      return respuestaError(res, mensaje, 400);
    }

    return respuestaError(res, "Error interno del servidor");
  }
};

const eliminarProducto = async (req: Request, res: Response) => {
  if (!req.usuario?.id) {
    return respuestaError(res, "Hace falta el id en el token", 400);
  }

  const { productoId } = req.params;

  if (!productoId) {
    return respuestaError(res, "Falta el id del producto", 400);
  }

  if (isNaN(Number(productoId))) {
    return respuestaError(res, "El id del producto debe de ser un número", 400);
  }

  try {
    await ServicioCarrito.eliminarProducto(req.usuario?.id, Number(productoId));

    return respuestaOk(res, "Producto eliminado del carrito con éxito");
  } catch (error) {
    console.error(error);

    return respuestaError(res, "Error interno del servidor");
  }
};

export const ControladorCarrito = {
  obtenerCarrito,
  agregarProducto,
  actualizarProducto,
  eliminarProducto,
};
