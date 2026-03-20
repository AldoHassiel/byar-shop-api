import { Middle } from "@/middleware/middleware.js";
import { Router } from "express";
import { ControladorMetodos } from "./metodosPago.controlador.js";

const rutasMetodosPago = Router();

rutasMetodosPago.get(
  "/usuario/:usuarioId/metodosPago",
  Middle.eresEseUsuario,
  ControladorMetodos.obtenerMetodos,
);

rutasMetodosPago.get(
  "/usuario/:usuarioId/metodosPago/:id",
  Middle.eresEseUsuario,
  ControladorMetodos.obtenerMetodo,
);

rutasMetodosPago.post(
  "/usuario/:usuarioId/metodosPago",
  Middle.eresEseUsuario,
  ControladorMetodos.crearMetodo,
);

rutasMetodosPago.put(
  "/usuario/:usuarioId/metodosPago/:id/predeterminada",
  Middle.eresEseUsuario,
  ControladorMetodos.establecerPredeterminada,
);

rutasMetodosPago.delete(
  "/usuario/:usuarioId/metodosPago/:id",
  Middle.eresEseUsuario,
  ControladorMetodos.eliminarMetodo,
);

export default rutasMetodosPago;
