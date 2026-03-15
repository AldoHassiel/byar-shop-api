import type { Request, Response } from "express";
import { respuesta } from "@/utilidades/respuesta.js";

export const iniciarSesion = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    res.status(500).json(respuesta(false, "Ha ocurrido un error", []));
  }
};
