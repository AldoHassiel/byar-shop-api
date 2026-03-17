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
    return respuestaError(res, "Token de administrador requerido", 401);
  }

  try {
    const datos = jwt.verify(token, SECRETO_JWT) as Token;

    if (!datos.es_admin) {
      return respuestaError(res, "No eres administrador, ¿Quien eres?", 403);
    }

    next();
  } catch (error) {
    return respuestaError(res, "Token invalido o expirado", 498);
  }
};

const eresEl = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  const id = req.body.id;

  if (!token) {
    return respuestaError(res, "Token de usuario requerido", 498);
  }

  try {
    const datos = jwt.verify(token, SECRETO_JWT) as Token;

    if (datos.es_admin) {
      return next();
    }

    if (datos.id !== id) {
      return respuestaError(res, "No eres ESE cliente, ¿Quien eres?", 401);
    }

    next();
  } catch (error) {
    return respuestaError(res, "Token invalido o expirado", 498);
  }
};

export const Middle = {
  eresEl,
  eresAdmin,
  leerToken,
};
