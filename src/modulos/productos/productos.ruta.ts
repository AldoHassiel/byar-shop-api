import { Router } from "express";
import { ControladorProductos } from "./productos.controlador.js";
import { Middle } from "@/middleware/middleware.js";

const rutasProductos = Router();

rutasProductos.get("/productos", ControladorProductos.obtenerProductos);
rutasProductos.get("/productos/:id", ControladorProductos.obtenerProducto);
rutasProductos.post(
  "/productos",
  Middle.eresAdmin,
  Middle.subirArchivos.single("imagen"),
  ControladorProductos.crearProducto,
);
rutasProductos.put(
  "/productos/:id",
  Middle.eresAdmin,
  Middle.subirArchivos.single("imagen"),
  ControladorProductos.editarProducto,
);
rutasProductos.delete(
  "/productos/:id",
  Middle.eresAdmin,
  ControladorProductos.eliminarProducto,
);

export default rutasProductos;
