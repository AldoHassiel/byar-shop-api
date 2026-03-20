import { SECRETO_JWT } from "@/config/global.js";
import { respuestaError } from "@/utilidades/respuesta.js";
import type { Token } from "@/utilidades/token.js";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import multer from "multer";

const leerToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) return next();

  try {
    const datos = jwt.verify(token, SECRETO_JWT) as Token;
    req.usuario = datos;
  } catch {}
  next();
};

const eresEseUsuario = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return respuestaError(res, "Token de usuario requerido", 498);
  }

  if (!req.params.usuarioId) {
    return respuestaError(res, "Token de usuario requerido", 498);
  }

  try {
    const datos = jwt.verify(token, SECRETO_JWT) as Token;

    if (datos.es_admin) {
      req.usuario = {
        id: Number(req.params.usuarioId),
        es_admin: true,
        correo: datos.correo,
      };
      return next();
    }

    if (datos.id !== Number(req.params.usuarioId)) {
      return respuestaError(res, "No eres ESE usuario", 401);
    }

    req.usuario = datos;
    return next();
  } catch (error) {
    return respuestaError(res, "Token inválido o expirado", 498);
  }
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

const subirArchivos = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, //5MB, no hay espacio :C
  fileFilter: (_req, file, cb) => {
    const tiposPermitidos = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ];
    if (tiposPermitidos.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten imágenes JPG, PNG o WEBP"));
    }
  },
});

export const Middle = {
  eresAdmin,
  eresEseUsuario,
  leerToken,
  subirArchivos,
};
