import { Router } from "express";
import { crearAdmin } from "./admin.controlador.js";

const enrutador = Router();

enrutador.post("/admin/crear", crearAdmin);

export default enrutador;
