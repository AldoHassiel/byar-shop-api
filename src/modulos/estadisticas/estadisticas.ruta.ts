import { Middle } from "@/middleware/middleware.js";
import { Router } from "express";
import { ControladorEstadisticas } from "./estadisticas.controlador.js";

const rutasEstadisticas = Router();

rutasEstadisticas.get(
  "/estadisticas",
  Middle.eresAdmin,
  ControladorEstadisticas.obtenerEstadisticas,
);

export default rutasEstadisticas;
