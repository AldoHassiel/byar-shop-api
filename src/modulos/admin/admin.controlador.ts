import type { Request, Response } from "express";
import { respuestaError, respuestaOk } from "@/utilidades/respuesta.js";
import { esquemaRegistro } from "../autenticacion/autenticacion.esquema.js";
import { ServicoAdmin } from "./admin.servicio.js";

export const crearAdmin = async (req: Request, res: Response) => {
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
    const resultado = await ServicoAdmin.crearAdmin(usuario.data);
    res.status(201).json(respuestaOk("Todo bien", resultado));
  } catch (error) {
    const mensaje = (error as Error).message;

    if (mensaje === "El correo ya está registrado") {
      res.status(409).json(respuestaError(mensaje, null));
      return;
    }

    res.status(500).json(respuestaError("Error interno del servidor", null));
  }
};
