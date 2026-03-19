import {
  respuestaError,
  respuestaErrorValidacion,
  respuestaOk,
} from "@/utilidades/respuesta.js";
import type { Request, Response } from "express";
import { ServicioDirecciones } from "./direcciones.servicio.js";
import { esquemaDireccones } from "./direcciones.esquema.js";

const obtenerDirecciones = async (req: Request, res: Response) => {
  if (!req.usuario?.id) {
    return respuestaError(res, "Hace falta el id en el token", 400);
  }

  try {
    const direcciones = await ServicioDirecciones.obtenerDirecciones(
      req.usuario?.id,
    );
    return respuestaOk(res, "Dirección obtenida con éxito", direcciones);
  } catch (error) {
    console.log(error);
    return respuestaError(res, "Error interno del servidor");
  }
};

const obtenerDireccion = async (req: Request, res: Response) => {
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
    const direccion = await ServicioDirecciones.obtenerDireccion(
      Number(id),
      req.usuario?.id,
    );
    return respuestaOk(res, "Dirección obtenida con éxito", direccion);
  } catch (error) {
    console.log(error);
    return respuestaError(res, "Error interno del servidor");
  }
};

const crearDireccion = async (req: Request, res: Response) => {
  const direccion = esquemaDireccones.safeParse(req.body);

  if (!direccion.success) {
    return respuestaErrorValidacion(res, direccion.error);
  }

  if (!req.usuario?.id) {
    return respuestaError(res, "Hace falta el id en el token", 400);
  }

  try {
    await ServicioDirecciones.crearDireccion(req.usuario?.id, direccion.data);
    return respuestaOk(res, "Dirección creada con éxito");
  } catch (error) {
    const mensaje = (error as Error).message;
    console.log(error);

    if (mensaje == "No se pudo crear la dirección") {
      return respuestaError(res, "No se pudo crear la dirección", 400);
    }

    return respuestaError(res, "Error interno del servidor");
  }
};

const editarDireccion = async (req: Request, res: Response) => {
  const direccion = esquemaDireccones.safeParse(req.body);

  if (!direccion.success) {
    return respuestaErrorValidacion(res, direccion.error);
  }

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
    await ServicioDirecciones.editarDireccion(
      req.usuario?.id,
      Number(id),
      direccion.data,
    );
    return respuestaOk(res, "Dirección editada con éxito");
  } catch (error) {
    const mensaje = (error as Error).message;
    console.log(error);

    if (mensaje == "No se pudo editar la dirección") {
      return respuestaError(res, "No se pudo editar la dirección", 400);
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
    await ServicioDirecciones.establecerPredeterminada(
      req.usuario?.id,
      Number(id),
    );
    return respuestaOk(
      res,
      "Dirección establecida como predeterminada con éxito",
    );
  } catch (error) {
    const mensaje = (error as Error).message;
    console.log(error);

    if (mensaje == "No se pudo establecer como predeterminada la dirección") {
      return respuestaError(
        res,
        "No se pudo establecer como predeterminada la dirección",
        400,
      );
    }

    return respuestaError(res, "Error interno del servidor");
  }
};

const eliminarDireccion = async (req: Request, res: Response) => {
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
    await ServicioDirecciones.eliminarDireccion(req.usuario?.id, Number(id));
    return respuestaOk(res, "Dirección eliminada con éxito");
  } catch (error) {
    const mensaje = (error as Error).message;
    console.log(error);

    if (mensaje == "No se pudo eliminar la dirección") {
      return respuestaError(res, "No se pudo eliminar la dirección", 400);
    }

    return respuestaError(res, "Error interno del servidor");
  }
};

export const ControladorDirecciones = {
  obtenerDirecciones,
  obtenerDireccion,
  crearDireccion,
  editarDireccion,
  establecerPredeterminada,
  eliminarDireccion,
};
