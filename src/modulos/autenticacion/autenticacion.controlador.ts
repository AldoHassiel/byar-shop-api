import type { Request, Response } from "express";
import {
  esquemaRegistro,
  esquemaInicioSesion,
} from "./autenticacion.esquema.js";
import { ServicioAutenticacion } from "./autenticacion.servicio.js";
import { respuestaError, respuestaOk } from "@/utilidades/respuesta.js";

const opcionesCookie = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "produccion",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const registrar = async (req: Request, res: Response) => {
  const usuario = esquemaRegistro.safeParse(req.body);

  if (!usuario.success) {
    const errores = usuario.error.issues.map((e) => ({
      campo: e.path.join("."),
      mensaje: e.message,
    }));

    res.status(400).json(respuestaError("Error de validaciones", errores));
    return;
  }

  try {
    const respuesta = await ServicioAutenticacion.registrar(usuario.data);

    res.cookie("token", respuesta.token, opcionesCookie);

    res.status(201).json(respuestaOk("Todo bien", respuesta.usuario));
  } catch (error) {
    const mensaje = (error as Error).message;

    if (mensaje === "El correo ya está registrado") {
      res.status(409).json(respuestaError(mensaje, null));
      return;
    }

    res.status(500).json(respuestaError("Error interno del servidor", null));
  }
};

export const iniciarSesion = async (req: Request, res: Response) => {
  const usuario = esquemaInicioSesion.safeParse(req.body);

  if (!usuario.success) {
    const errores = usuario.error.issues.map((e) => ({
      campo: e.path.join("."),
      mensaje: e.message,
    }));

    res.status(400).json(respuestaError("Error de validaciones", errores));
    return;
  }

  try {
    const respuesta = await ServicioAutenticacion.iniciarSesion(usuario.data);

    res.cookie("token", respuesta.token, opcionesCookie);

    res.status(200).json(respuestaOk("Todo bien", respuesta.usuario));
  } catch (error) {
    const mensaje = (error as Error).message;

    if (mensaje === "Correo o contraseña incorrectos") {
      res.status(401).json({ mensaje });
      return;
    }

    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

export const cerrarSesion = async (_req: Request, res: Response) => {
  res.clearCookie("token", opcionesCookie);
  res.json(respuestaOk("Sesión cerrada correctamente", null));
};
