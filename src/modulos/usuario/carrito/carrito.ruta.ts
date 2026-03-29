import { Middle } from "@/middleware/middleware.js";
import { Router } from "express";
import { ControladorCarrito } from "./carrito.controlador.js";

const rutaCarrito = Router();

rutaCarrito.get(
  "/usuario/:usuarioId/carrito",
  Middle.eresEseUsuario,
  ControladorCarrito.obtenerCarrito,
);

rutaCarrito.post(
  "/usuario/:usuarioId/carrito/",
  Middle.eresEseUsuario,
  ControladorCarrito.agregarProducto,
);

rutaCarrito.patch(
  "/usuario/:usuarioId/carrito/:productoId",
  Middle.eresEseUsuario,
  ControladorCarrito.actualizarProducto,
);

rutaCarrito.delete(
  "/usuario/:usuarioId/carrito/:productoId",
  Middle.eresEseUsuario,
  ControladorCarrito.eliminarProducto,
);

export default rutaCarrito;
