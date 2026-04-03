import { Router } from "express";
import { ControladorNegocio } from "./negocio.controlador.js";
import { Middle } from "@/middleware/middleware.js";

const rutasNegocio = Router();

rutasNegocio.get("/negocio", ControladorNegocio.obtenerNegocio);
rutasNegocio.put(
  "/negocio",
  Middle.eresAdmin,
  Middle.subirArchivos.fields([
    { name: "logotipo", maxCount: 1 },
    { name: "imagen_sobre_nosotros", maxCount: 1 },
    { name: "hero_imagen", maxCount: 1 },
  ]),
  ControladorNegocio.editarNegocio,
);

export default rutasNegocio;
