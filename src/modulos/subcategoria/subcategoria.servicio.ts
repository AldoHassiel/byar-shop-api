import { db } from "@/config/db.js";
import { type SubcategoriaDTO } from "./subcategoria.esquema.js";
import { ca } from "zod/locales";

const obtenerSubcategorias = async (es_admin: boolean | undefined) => {
  if (es_admin) {
    const consulta = await db.query(
      `SELECT id, id_categoria, nombre, descripcion, cant_producto
      FROM subcategorias WHERE activo = $1`,
      [true],
    );

    return consulta.rows;
  }

  const consulta = await db.query(
    `SELECT id, nombre
    FROM subcategorias WHERE activo = $1`,
    [true],
  );
  return consulta.rows;
};

const obtenerSubcategoria = async (
  id: number,
  es_admin: boolean | undefined,
) => {
  if (es_admin) {
    const consulta = await db.query(
      `SELECT id, id_categoria, nombre, descripcion, cant_producto
      FROM subcategorias WHERE id = $1 AND activo = $2`,
      [id, true],
    );

    return consulta.rows;
  }

  const consulta = await db.query(
    `SELECT id, nombre
    FROM subcategorias WHERE id = $1 AND activo = $2`,
    [id, true],
  );
  return consulta.rows;
};

const crearSubcategoria = async (datos: SubcategoriaDTO) => {
  const { id_categoria, nombre, descripcion } = datos;

  const { rowCount: categoriaExiste } = await db.query(
    `SELECT id FROM subcategorias WHERE nombre = $1 AND activo = $2`,
    [nombre, true],
  );

  if (categoriaExiste && categoriaExiste > 0) {
    throw Error("Ya existe esa subcategoría");
  }

  const { rowCount: filasAfectadas } = await db.query(
    `INSERT INTO subcategorias (id_categoria, nombre, descripcion)
    VALUES ($1, $2, $3)`,
    [id_categoria, nombre, descripcion],
  );

  if (!filasAfectadas) {
    throw Error("Algo pasó en la base de datos");
  }

  return;
};

const editarSubcategoria = async (id: number, datos: SubcategoriaDTO) => {
  const { id_categoria, nombre, descripcion } = datos;

  const { rowCount: filasEncontradas } = await db.query(
    `
    SELECT id
    FROM subcategorias
    WHERE activo = $1 AND nombre = $2 AND id <> $3
    `,
    [true, nombre, id],
  );

  if (filasEncontradas && filasEncontradas > 0) {
    throw Error("Ya existe esa subcategoria");
  }

  const { rowCount: filasAfectadas } = await db.query(
    `UPDATE subcategorias SET id_categoria = $1, nombre = $2, descripcion = $3 WHERE id = $4`,
    [id_categoria, nombre, descripcion, id],
  );

  if (!filasAfectadas) {
    throw Error("Algo pasó en la base de datos");
  }

  return;
};

const eliminarSubcategoria = async (id: number) => {
  const { rowCount: filasAfectadas } = await db.query(
    "UPDATE subcategorias SET activo = $1 WHERE id = $2",
    [false, id],
  );

  if (!filasAfectadas) {
    throw Error("Algo pasó en la base de datos");
  }

  return;
};

export const ServicioSubcategorias = {
  obtenerSubcategorias,
  obtenerSubcategoria,
  crearSubcategoria,
  editarSubcategoria,
  eliminarSubcategoria,
};
