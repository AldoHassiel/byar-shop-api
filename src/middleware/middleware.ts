import { SECRETO_JWT } from "@/config/global.js";
import { respuestaError } from "@/utilidades/respuesta.js";
import type { Token } from "@/utilidades/token.js";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const leerToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) return next();

  try {
    const datos = jwt.verify(token, SECRETO_JWT) as Token;
    req.usuario = datos;
  } catch {}
  next();
};

const eresAdmin = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json(respuestaError("Token de administrador requerido", null));
  }

  try {
    const datos = jwt.verify(token, SECRETO_JWT) as Token;

    if (!datos.es_admin) {
      return res
        .status(401)
        .json(respuestaError("No eres administrador, ¿Quien eres?", null));
    }

    next();
  } catch (error) {
    return res
      .status(401)
      .json(respuestaError("Token invalido o expirado", null));
  }
};

const eresEl = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  const id = req.body.id;

  if (!token) {
    return res
      .status(401)
      .json(respuestaError("Token de usuario requerido", null));
  }

  try {
    const datos = jwt.verify(token, SECRETO_JWT) as Token;

    if (datos.es_admin) {
      return next();
    }

    if (datos.id !== id) {
      return res
        .status(401)
        .json(respuestaError("No eres ESE cliente, ¿Quien eres?", null));
    }

    next();
  } catch (error) {
    return res
      .status(401)
      .json(respuestaError("Token invalido o expirado", null));
  }
};

export const Middle = {
  eresEl,
  eresAdmin,
  leerToken,
};
