import { db } from "@/config/db.js";
import type { MarcaDTO } from "./marcas.esquema.js";

const obtenerMarcas = async (es_admin: boolean | undefined) => {
  if (es_admin) {
    const { rows: marcas } = await db.query(
      `
      SELECT id, nombre, descripcion, cant_producto
      FROM marcas
      WHERE activo = $1
      ORDER BY cant_producto DESC
      `,
      [true],
    );

    return marcas;
  }

  const { rows: marcas } = await db.query(
    `
    SELECT id, nombre
    FROM marcas
    WHERE activo = $1`,
    [true],
  );

  return marcas;
};

const obtenerMarca = async (id: Number, es_admin: boolean | undefined) => {
  if (es_admin) {
    const { rows: marcas } = await db.query(
      `
      SELECT id, nombre, descripcion, cant_producto
      FROM marcas
      WHERE activo = $1 AND id = $2`,
      [true, id],
    );

    return marcas;
  }

  const { rows: marcas } = await db.query(
    `
    SELECT id, nombre
    FROM marcas
    WHERE activo = $1 AND id = $2`,
    [true, id],
  );

  return marcas;
};

const crearMarca = async (datos: MarcaDTO) => {
  const { nombre, descripcion } = datos;

  const { rowCount: filasEncontradas } = await db.query(
    `
    SELECT id
    FROM marcas
    WHERE activo = $1 AND nombre = $2
    `,
    [true, nombre],
  );

  if (filasEncontradas && filasEncontradas > 0) {
    throw Error("Ya existe esa marca");
  }

  const { rowCount: filaAfectada } = await db.query(
    `
    INSERT INTO marcas(nombre, descripcion)
    VALUES ($1, $2)
    `,
    [nombre, descripcion],
  );
  console.log(filaAfectada);

  if (!filaAfectada) {
    throw Error("Algo pasó en la base de datos");
  }

  return;
};

const editarMarca = async (id: number, datos: MarcaDTO) => {
  const { nombre, descripcion } = datos;

  const { rowCount: filasEncontradas } = await db.query(
    `
    SELECT id
    FROM marcas
    WHERE activo = $1 AND nombre = $2 AND id <> $3
    `,
    [true, nombre, id],
  );

  if (filasEncontradas && filasEncontradas > 0) {
    throw Error("Ya existe esa marca");
  }

  const { rowCount: filaAfectada } = await db.query(
    `
    UPDATE marcas SET
      nombre = $1,
      descripcion = $2
    WHERE id = $3
    `,
    [nombre, descripcion, id],
  );

  if (!filaAfectada) {
    throw Error("Algo pasó en la base de datos");
  }

  return;
};

const eliminarMarca = async (id: number) => {
  const { rowCount: filaAfectada } = await db.query(
    `
    UPDATE marcas SET
      activo = $1
    WHERE id = $2
    `,
    [false, id],
  );

  if (!filaAfectada) {
    throw Error("Algo pasó en la base de datos");
  }

  return;
};

export const ServicioMarcas = {
  obtenerMarcas,
  obtenerMarca,
  crearMarca,
  editarMarca,
  eliminarMarca,
};
