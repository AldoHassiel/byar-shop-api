import type { Request, Response } from "express";
import { ServicioNegocio } from "./negocio.servicio.js";
import {
    respuestaAPI,
    respuestaError,
    respuestaErrorValidacion,
    respuestaOk,
} from "@/utilidades/respuesta.js";


const obtenerNegocio = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (!id) {
        return respuestaError(res, "ID inválido", 400);
    }

    try {
        const negocio = await ServicioNegocio.obtenerNegocio(id);

        if (negocio.length === 0) {
            return respuestaError(res, "No se encontró información del negocio", 404);
        }

        return respuestaAPI(res, "Negocio obtenido con éxito", negocio[0]);
    } catch (error) {
        console.log(error);
        return respuestaError(res, "Error interno del servidor");
    }
};

export const ControladorNegocio = {
    obtenerNegocio,
}