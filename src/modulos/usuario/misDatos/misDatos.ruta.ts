import { Middle } from "@/middleware/middleware.js";
import { Router } from "express";
import { ControladorMisDatos } from "./misDatos.controlador.js";

const rutaMisDatos = Router();

rutaMisDatos.get(
  "/usuario/:usuarioId/misDatos",
  Middle.eresEseUsuario,
  ControladorMisDatos.obtenerDatos,
);

rutaMisDatos.put(
  "/usuario/:usuarioId/misDatos/editar",
  Middle.eresEseUsuario,
  ControladorMisDatos.editarDatosGenerales,
);

rutaMisDatos.patch(
  "/usuario/:usuarioId/misDatos/correo",
  Middle.eresEseUsuario,
  ControladorMisDatos.editarCorreo,
);

rutaMisDatos.patch(
  "/usuario/:usuarioId/misDatos/pwd",
  Middle.eresEseUsuario,
  ControladorMisDatos.editarPwd,
);

rutaMisDatos.delete(
  "/usuario/:usuarioId/misDatos/cuenta",
  Middle.eresEseUsuario,
  ControladorMisDatos.eliminarCuenta,
);

export default rutaMisDatos;
