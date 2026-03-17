import { Router } from "express";
import {
  registrar,
  iniciarSesion,
  cerrarSesion,
} from "./autenticacion.controlador.js";

const enrutador = Router();

enrutador.post("/auth/registrar", registrar);
enrutador.post("/auth/iniciarSesion", iniciarSesion);
enrutador.post("/auth/cerrarSesion", cerrarSesion);

export default enrutador;
