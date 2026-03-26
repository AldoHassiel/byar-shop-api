import { Router } from "express";
import { ControladorSubcategoria } from "./subcategoria.controlador.js";
import { Middle } from "@/middleware/middleware.js";

const enrutador = Router();

enrutador.get(
  "/subcategorias",
  Middle.leerToken,
  ControladorSubcategoria.obtenerSubcategorias,
);

enrutador.get(
  "/categorias-subcategorias",
  Middle.leerToken,
  ControladorSubcategoria.obtenerCategoriasConSubcategorias,
);

enrutador.get(
  "/subcategorias/:id",
  Middle.leerToken,
  ControladorSubcategoria.obtenerSubcategoria,
);

enrutador.post(
  "/subcategorias",
  Middle.eresAdmin,
  ControladorSubcategoria.crearSubcategoria,
);

enrutador.put(
  "/subcategorias/:id",
  Middle.eresAdmin,
  ControladorSubcategoria.editarSubcategoria,
);

enrutador.delete(
  "/subcategorias/:id",
  Middle.eresAdmin,
  ControladorSubcategoria.eliminarSubcategoria,
);

export default enrutador;
