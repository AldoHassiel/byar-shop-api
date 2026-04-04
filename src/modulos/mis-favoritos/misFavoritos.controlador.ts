import type { Request, Response } from "express";
import {
    respuestaAPI,
    respuestaError,
    respuestaOk,
    respuestaErrorValidacion,
} from "@/utilidades/respuesta.js";
import { ServicioMisFavoritos } from "./misFavoritos.servicio.js";


const obtenerFavoritos = async (req: Request, res: Response) => {
    try {
        const idUsuario = Number(req.usuario?.id);
        if (!idUsuario || isNaN(idUsuario)) {
            return respuestaError(res, "Necesitas iniciar sesión", 401);
        }

        const favoritos = await ServicioMisFavoritos.obtenerFavoritos(
            idUsuario,
        );
        return respuestaOk(res, "Favoritos obtenidos", favoritos);
    } catch (error) {
        return respuestaError(res, (error as Error).message || "Error interno");
    }
};


const eliminarFavorito = async (req: Request, res: Response) => {
    try {
        const idUsuario = Number(req.usuario?.id);
        const { id } = req.params;

        if (!idUsuario) {
            return respuestaError(res, "Necesitas iniciar sesión", 401);
        }

        if (!id) {
            return respuestaError(res, "idProducto es requerido", 405);
        }

        await ServicioMisFavoritos.eliminarFavorito(
            idUsuario,
            Number(id)
        );

        return respuestaOk(res, "Producto eliminado de favoritos");
    } catch (error) {
        return respuestaError(res, (error as Error).message);
    }
};

const agregarFavorito = async (req: Request, res: Response) => {
    try {
        const idUsuario = Number(req.usuario?.id);
        const { id } = req.params;

        if (!idUsuario) {
            return respuestaError(res, "Necesitas iniciar sesión", 401);
        }

        if (!id) {
            return respuestaError(res, "idProducto es requerido", 405);
        }

        await ServicioMisFavoritos.agregarFavorito(idUsuario, Number(id));

        return respuestaOk(res, "Producto agregado a favoritos");
    } catch (error) {
        return respuestaError(res, (error as Error).message);
    }
};

export const ControladorMisFavoritos = {
    obtenerFavoritos,
    agregarFavorito,
    eliminarFavorito,
};