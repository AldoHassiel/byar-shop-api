import type { Request, Response } from "express";
import {
  esquemaRegistro,
  esquemaInicioSesion,
} from "./autenticacion.esquema.js";
import { ServicioAutenticacion } from "./autenticacion.servicio.js";
import {
  respuestaError,
  respuestaErrorValidacion,
  respuestaOk,
} from "@/utilidades/respuesta.js";

const opcionesCookie = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "produccion",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const registrar = async (req: Request, res: Response) => {
  const usuario = esquemaRegistro.safeParse(req.body);

  if (!usuario.success) {
    return respuestaErrorValidacion(res, usuario.error);
  }

  try {
    const respuesta = await ServicioAutenticacion.registrar(usuario.data);

    res.cookie("token", respuesta.token, opcionesCookie);

    return respuestaOk(res, "Todo bien", [respuesta.usuario], 201);
  } catch (error) {
    const mensaje = (error as Error).message;

    if (mensaje === "El correo ya está registrado") {
      respuestaError(res, mensaje, 409);
      return;
    }

    respuestaError(res, "Error interno del servidor", 500);
  }
};

export const iniciarSesion = async (req: Request, res: Response) => {
  const usuario = esquemaInicioSesion.safeParse(req.body);

  if (!usuario.success) {
    return respuestaErrorValidacion(res, usuario.error);
  }

  try {
    const respuesta = await ServicioAutenticacion.iniciarSesion(usuario.data);

    res.cookie("token", respuesta.token, opcionesCookie);

    return respuestaOk(
      res,
      "Iniciado sesión éxitosamente",
      [respuesta.usuario],
      200,
    );
  } catch (error) {
    const mensaje = (error as Error).message;

    if (mensaje === "Correo o contraseña incorrectos") {
      return respuestaError(res, mensaje, 401);
    }

    return respuestaError(res, "Error interno del servidor", 500);
  }
};

export const cerrarSesion = async (_req: Request, res: Response) => {
  res.clearCookie("token", opcionesCookie);
  respuestaOk(res, "Sesión cerrada correctamente", 200);
};
