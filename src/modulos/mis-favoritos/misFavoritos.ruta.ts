import { Router } from "express";
import { ControladorMisFavoritos } from "./misFavoritos.controlador.js";
import { Middle } from "@/middleware/middleware.js";

const rutasFavoritos = Router();

rutasFavoritos.get("/usuarios/:usuarioId/mis-favoritos", Middle.eresEseUsuario, ControladorMisFavoritos.obtenerFavoritos);
rutasFavoritos.delete("/usuarios/:usuarioId/mis-favoritos/eliminar/producto/:id", Middle.eresEseUsuario, ControladorMisFavoritos.eliminarFavorito);
rutasFavoritos.post("/usuarios/:usuarioId/mis-favoritos/agregar/producto/:id", Middle.eresEseUsuario, ControladorMisFavoritos.agregarFavorito);

export default rutasFavoritos;
