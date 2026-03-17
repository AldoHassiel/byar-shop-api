import { db } from "@/config/db.js";
import type { CategoriaDTO } from "./categoria.esquema.js";

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

const obtenerCategoria = async (id: number, es_admin: boolean | undefined) => {
  if (es_admin) {
    const consulta = await db.query(
      `SELECT id, nombre, descripcion, cant_producto
      FROM categorias WHERE id = $1 AND activo = $2`,
      [id, true],
    );

    return consulta.rows;
  }

  const consulta = await db.query(
    `SELECT id, nombre
    FROM categorias WHERE id = $1 AND activo = $2`,
    [id, true],
  );
  return consulta.rows;
};

const crearCategoria = async (datos: CategoriaDTO) => {
  const { nombre, descripcion } = datos;

  const { rowCount: categoriaExiste } = await db.query(
    `SELECT id FROM categorias WHERE nombre = $1 AND activo = $2`,
    [nombre, true],
  );

  if (categoriaExiste) {
    throw Error("Ya existe esa categoría");
  }

  const { rowCount: filasAfectadas } = await db.query(
    `INSERT INTO categorias (nombre, descripcion)
    VALUES ($1, $2)`,
    [nombre, descripcion],
  );

  if (!filasAfectadas) {
    throw Error("Algo pasó en la base de datos");
  }

  return;
};

const eliminarCategoria = async (id: number) => {
  const { rowCount: filasAfectadas } = await db.query(
    "UPDATE categorias SET activo = $1 WHERE id = $2",
    [false, id],
  );

  if (!filasAfectadas) {
    throw Error("Algo pasó en la base de datos");
  }

  return;
};

export const ServicioCategorias = {
  obtenerCategorias,
  obtenerCategoria,
  crearCategoria,
  eliminarCategoria,
};
