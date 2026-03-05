import { Router } from "express";
import { obtenerProductos } from "../controladores/productos.controlador.js";

const router = Router();

router.get("/productos", obtenerProductos);

export default router;
