import { Router } from "express";
import { crearAdmin } from "./admin.controlador.js";
import { Middle } from "@/middleware/middleware.js";

const enrutador = Router();

enrutador.post("/admin/crear", Middle.eresAdmin, crearAdmin);

export default enrutador;
