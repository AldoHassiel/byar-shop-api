import { Router } from "express";
import { ControladorNegocio } from "./negocio.controlador.js";

const rutasNegocio = Router();


rutasNegocio.get("/negocio/:id", ControladorNegocio.obtenerNegocio);


export default rutasNegocio;