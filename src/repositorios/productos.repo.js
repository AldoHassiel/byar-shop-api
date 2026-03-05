import { db } from "../config/db.js";

export const productoRepo = {
  obtenerTodos: async () => {
    try {
      const result = await db.query("SELECT * FROM Productos");
      return result.rows;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  },
};
