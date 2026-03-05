import { productoServicio } from "../servicios/productos.servicio.js";

export const obtenerProductos = async (_, res) => {
  try {
    const productos = await productoServicio.obtenerTodos();

    res.json({
      estado: true,
      mensaje: "Productos obtenidos correctamente",
      datos: productos,
    });
  } catch (error) {
    res.status(500).json({
      estado: false,
      mensaje: error.message,
      datos: null,
    });
  }
};
