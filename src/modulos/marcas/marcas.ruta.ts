import { Middle } from "@/middleware/middleware.js";
import { Router } from "express";
import { ControladorMarcas } from "./marcas.controlador.js";

const enrutador = Router();

enrutador.get("/marcas", Middle.leerToken, ControladorMarcas.obtenerMarcas);
enrutador.get("/marcas/:id", Middle.leerToken, ControladorMarcas.obtenerMarca);
enrutador.post("/marcas", Middle.eresAdmin, ControladorMarcas.crearMarca);
enrutador.put("/marcas/:id", Middle.eresAdmin, ControladorMarcas.editarMarca);
enrutador.delete(
  "/marcas/:id",
  Middle.eresAdmin,
  ControladorMarcas.eliminarMarca,
);

export default enrutador;
