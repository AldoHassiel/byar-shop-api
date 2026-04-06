import { Middle } from "@/middleware/middleware.js";
import { Router } from "express";
import { ControladorCompras } from "./compras.controlador.js";

const rutasCompras = Router();

rutasCompras.get(
  "/usuario/:usuarioId/compras",
  Middle.eresEseUsuario,
  ControladorCompras.obtenerCompras,
);

rutasCompras.get(
  "/usuario/:usuarioId/compras/:id",
  Middle.eresEseUsuario,
  ControladorCompras.obtenerDetalleCompra,
);

rutasCompras.post(
  "usuario/:usuarioId/compras/",
  Middle.eresEseUsuario,
  ControladorCompras.realizarCompra,
);

export default rutasCompras;
