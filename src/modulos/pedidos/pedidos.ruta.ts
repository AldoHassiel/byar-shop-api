import { Middle } from "@/middleware/middleware.js";
import { Router } from "express";
import { ControladorPedidos } from "./pedidos.controlador.js";

const rutasPedidos = Router();

rutasPedidos.get(
  "/pedidos",
  Middle.eresAdmin,
  ControladorPedidos.obtenerPedidos,
);

rutasPedidos.get(
  "/pedidos/:id",
  Middle.eresAdmin,
  ControladorPedidos.obtenerPedido,
);

rutasPedidos.put(
  "/pedidos/:id",
  Middle.eresAdmin,
  ControladorPedidos.cambiarEstado,
);

export default rutasPedidos;
