import { type Response } from "express";
import { ZodError } from "zod";

export interface ApiResponse<T> {
  estado: boolean;
  mensaje: string;
  datos: T | null;
}

export const respuestaOk = <T>(
  res: Response,
  mensaje: string,
  datos: T | null = null,
  codigo: number = 200,
): Response => {
  const respuesta: ApiResponse<T> = {
    estado: true,
    mensaje,
    datos,
  };
  return res.status(codigo).json(respuesta);
};

export const respuestaError = (
  res: Response,
  mensaje: string,
  codigo: number = 500,
): Response => {
  const respuesta: ApiResponse<unknown> = {
    estado: false,
    mensaje,
    datos: null,
  };
  return res.status(codigo).json(respuesta);
};

export const respuestaErrorValidacion = (
  res: Response,
  error: ZodError,
): Response => {
  const errores = error.issues.map((e) => ({
    campo: e.path.join("."),
    mensaje: e.message,
  }));

  const respuesta: ApiResponse<typeof errores> = {
    estado: false,
    mensaje: "Error de validaciones",
    datos: errores,
  };
  return res.status(400).json(respuesta);
};
