import { Router } from "express";
import { ControladorMisFavoritos } from "./misFavoritos.controlador.js";
import { Middle } from "@/middleware/middleware.js";

const rutasFavoritos = Router();

rutasFavoritos.get("/mis-favoritos/:usuarioId", Middle.leerToken, Middle.eresEseUsuario, ControladorMisFavoritos.obtenerFavoritos);
rutasFavoritos.delete("/mis-favoritos/eliminar/:usuarioId/:id", Middle.leerToken, Middle.eresEseUsuario, ControladorMisFavoritos.eliminarFavorito);
rutasFavoritos.post("/mis-favoritos/agregar/:usuarioId/:id", Middle.leerToken, Middle.eresEseUsuario, ControladorMisFavoritos.agregarFavorito);

export default rutasFavoritos;
