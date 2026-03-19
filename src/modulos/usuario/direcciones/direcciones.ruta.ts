import { Middle } from "@/middleware/middleware.js";
import { Router } from "express";
import { ControladorDirecciones } from "./direcciones.controlador.js";

const rutasDirecciones = Router();

rutasDirecciones.get(
  "/usuario/:usuarioId/direcciones",
  Middle.eresEseUsuario,
  ControladorDirecciones.obtenerDirecciones,
);

rutasDirecciones.get(
  "/usuario/:usuarioId/direcciones/:id",
  Middle.eresEseUsuario,
  ControladorDirecciones.obtenerDireccion,
);

rutasDirecciones.post(
  "/usuario/:usuarioId/direcciones/",
  Middle.eresEseUsuario,
  ControladorDirecciones.crearDireccion,
);

rutasDirecciones.post(
  "/usuario/:usuarioId/direcciones/:id",
  Middle.eresEseUsuario,
  ControladorDirecciones.editarDireccion,
);

rutasDirecciones.patch(
  "/usuario/:usuarioId/direcciones/:id/predeterminada",
  Middle.eresEseUsuario,
  ControladorDirecciones.establecerPredeterminada,
);

rutasDirecciones.delete(
  "/usuario/:usuarioId/direcciones/:id",
  Middle.eresEseUsuario,
  ControladorDirecciones.eliminarDireccion,
);

export default rutasDirecciones;
