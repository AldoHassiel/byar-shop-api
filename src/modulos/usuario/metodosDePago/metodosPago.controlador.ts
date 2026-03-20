import {
  respuestaError,
  respuestaErrorValidacion,
  respuestaOk,
} from "@/utilidades/respuesta.js";
import type { Request, Response } from "express";
import { ServicioMetodosPagos } from "./metodosPago.servicio.js";
import { esquemaMetodosPago } from "./metodosPago.esquema.js";

const obtenerMetodos = async (req: Request, res: Response) => {
  if (!req.usuario?.id) {
    return respuestaError(res, "Hace falta el id en el token", 400);
  }

  try {
    const metodos = await ServicioMetodosPagos.obtenerMetodos(req.usuario?.id);
    return respuestaOk(res, "Métodos de pago obtenidos con éxito", metodos);
  } catch (error) {
    console.log(error);
    return respuestaError(res, "Error interno del servidor");
  }
};

const obtenerMetodo = async (req: Request, res: Response) => {
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
    const metodos = await ServicioMetodosPagos.obtenerMetodo(
      req.usuario?.id,
      Number(id),
    );
    return respuestaOk(res, "Método de pago obtenido con éxito", metodos);
  } catch (error) {
    console.log(error);
    return respuestaError(res, "Error interno del servidor");
  }
};

const crearMetodo = async (req: Request, res: Response) => {
  const metodo = esquemaMetodosPago.safeParse(req.body);

  if (!metodo.success) {
    return respuestaErrorValidacion(res, metodo.error);
  }

  if (!req.usuario?.id) {
    return respuestaError(res, "Hace falta el id en el token", 400);
  }

  try {
    await ServicioMetodosPagos.crearMetodo(req.usuario?.id, metodo.data);
    return respuestaOk(res, "Método de pago creado con éxito");
  } catch (error) {
    const mensaje = (error as Error).message;
    console.log(error);

    if (mensaje == "No se pudo crear el método de pago") {
      return respuestaError(res, "No se pudo crear el método de pago", 400);
    }

    return respuestaError(res, "Error interno del servidor");
  }
};

const establecerPredeterminada = async (req: Request, res: Response) => {
  if (!req.usuario?.id) {
    return respuestaError(res, "Hace falta el id en el token", 400);
  }

  const { id } = req.params;

  if (!id) {
    return respuestaError(res, "Falta el id de la dirección", 400);
  }

  if (isNaN(Number(id))) {
    return respuestaError(
      res,
      "El id de la dirección debe de ser un número",
      400,
    );
  }

  try {
    await ServicioMetodosPagos.establecerPredeterminada(
      req.usuario?.id,
      Number(id),
    );
    return respuestaOk(
      res,
      "Método de pago establecido como predeterminada con éxito",
    );
  } catch (error) {
    const mensaje = (error as Error).message;
    console.log(error);

    if (
      mensaje == "No se pudo establecer como predeterminada el método de pago"
    ) {
      return respuestaError(
        res,
        "No se pudo establecer como predeterminada el método de pago",
        400,
      );
    }

    return respuestaError(res, "Error interno del servidor");
  }
};

const eliminarMetodo = async (req: Request, res: Response) => {
  if (!req.usuario?.id) {
    return respuestaError(res, "Hace falta el id en el token", 400);
  }

  const { id } = req.params;

  if (!id) {
    return respuestaError(res, "Falta el id de la dirección", 400);
  }

  if (isNaN(Number(id))) {
    return respuestaError(
      res,
      "El id de la dirección debe de ser un número",
      400,
    );
  }

  try {
    await ServicioMetodosPagos.eliminarMetodo(req.usuario?.id, Number(id));
    return respuestaOk(res, "Método de pago eliminado con éxito");
  } catch (error) {
    const mensaje = (error as Error).message;
    console.log(error);

    if (mensaje == "No se pudo eliminar el método de pago") {
      return respuestaError(res, "No se pudo eliminar el método de pago", 400);
    }

    return respuestaError(res, "Error interno del servidor");
  }
};

export const ControladorMetodos = {
  obtenerMetodos,
  obtenerMetodo,
  crearMetodo,
  establecerPredeterminada,
  eliminarMetodo,
};
