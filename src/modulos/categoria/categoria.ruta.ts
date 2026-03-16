import { Router } from "express";
import { ControladorCategoria } from "./categoria.controlador.js";
import { Middle } from "@/middleware/middleware.js";

const enrutador = Router();

enrutador.get(
  "/categorias",
  Middle.leerToken,
  ControladorCategoria.obtenerCategorias,
);

export default enrutador;
