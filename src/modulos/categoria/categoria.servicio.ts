import { db } from "@/config/db.js";

const obtenerCategorias = async (es_admin: boolean | undefined) => {
  if (es_admin) {
    const consulta = await db.query(
      `SELECT id, nombre, descripcion, cant_producto
      FROM categorias WHERE activo = $1`,
      [true],
    );

    return consulta.rows;
  }

  const consulta = await db.query(
    `SELECT id, nombre
    FROM categorias WHERE activo = $1`,
    [true],
  );
  return consulta.rows;
};

export const ServicioCategorias = {
  obtenerCategorias,
};
