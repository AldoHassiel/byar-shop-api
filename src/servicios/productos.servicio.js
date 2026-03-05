import { productoRepo } from "../repositorios/productos.repo.js";

export const productoServicio = {
  obtenerTodos: async () => {
    try {
      const productos = await productoRepo.obtenerTodos();
      return productos;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
