import type { Request, Response } from "express";
import {
  respuestaError,
  respuestaErrorValidacion,
  respuestaOk,
} from "@/utilidades/respuesta.js";
import { esquemaRegistro } from "../autenticacion/autenticacion.esquema.js";
import { ServicoAdmin } from "./admin.servicio.js";

export const crearAdmin = async (req: Request, res: Response) => {
  const usuario = esquemaRegistro.safeParse(req.body);

  if (!usuario.success) {
    return respuestaErrorValidacion(res, usuario.error);
  }

  try {
    const resultado = await ServicoAdmin.crearAdmin(usuario.data);
    return respuestaOk(res, "Todo bien", resultado, 201);
  } catch (error) {
    const mensaje = (error as Error).message;

    if (mensaje === "El correo ya está registrado") {
      return respuestaError(res, mensaje, 401);
    }

    return respuestaError(res, "Error interno del servidor");
  }
};
