import { Router } from "express";
import { ControladorNegocio } from "./negocio.controlador.js";

const rutasNegocio = Router();


rutasNegocio.get("/negocio", ControladorNegocio.obtenerNegocio);


export default rutasNegocio;