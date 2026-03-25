import { Router } from "express";
import { ControladorNegocio } from "./negocio.controlador.js";
import { Middle } from "@/middleware/middleware.js";

const rutasNegocio = Router();

rutasNegocio.get("/negocio", ControladorNegocio.obtenerNegocio);
rutasNegocio.get(
  "/negocio",
  Middle.eresAdmin,
  Middle.subirArchivos.fields([
    { name: "imagen_sobre_de", maxCount: 1 },
    { name: "imagen_hero", maxCount: 1 },
  ]),
  ControladorNegocio.obtenerNegocio,
);

export default rutasNegocio;
