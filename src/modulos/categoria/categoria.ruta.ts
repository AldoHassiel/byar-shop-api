import { Router } from "express";
import { ControladorCategoria } from "./categoria.controlador.js";
import { Middle } from "@/middleware/middleware.js";

const enrutador = Router();

enrutador.get(
  "/categorias",
  Middle.leerToken,
  ControladorCategoria.obtenerCategorias,
);

enrutador.get(
  "/categorias/:id",
  Middle.leerToken,
  ControladorCategoria.obtenerCategoria,
);

enrutador.post(
  "/categorias",
  Middle.eresAdmin,
  ControladorCategoria.crearCategoria,
);

enrutador.delete(
  "/categorias/:id",
  Middle.eresAdmin,
  ControladorCategoria.eliminarCategoria,
);

export default enrutador;
