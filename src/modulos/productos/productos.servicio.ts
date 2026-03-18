import { db } from "@/config/db.js";
import type { FiltrosProductoDTO, ProductoDTO } from "./productos.esquema.js";

export const obtenerProductos = async (filtros: FiltrosProductoDTO) => {
  const consulta = await db.query(
    `
    SELECT * FROM obtener_productos($1, $2, $3, $4, $5, $6, $7, $8)
    `,
    [
      filtros.nombre || null,
      filtros.id_marca || null,
      filtros.id_categoria || null,
      filtros.id_subcategoria || null,
      filtros.precio_min || null,
      filtros.precio_max || null,
      filtros.pagina || null,
      filtros.limite || null,
    ],
  );

  return consulta.rows.map(({ total_registros, ...resto }) => resto);
};

export const obtenerProducto = async (id: number) => {
  const consulta = await db.query(
    `
    SELECT * FROM obtener_producto($1)
    `,
    [id],
  );

  return consulta.rows;
};

export const crearProducto = async (datos: ProductoDTO) => {
  const { rowCount: filasEncontradas } = await db.query(
    `
    SELECT id
    FROM productos
    WHERE activo = $1 AND nombre = $2
    `,
    [true, datos.nombre],
  );

  if (filasEncontradas && filasEncontradas > 0) {
    throw Error("Ya existe ese producto");
  }

  const { rowCount: filaAfectada } = await db.query(
    `
    INSERT INTO productos(imagen_url, nombre, descripcion, precio, stock, id_subcategoria, id_marca)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,
    [
      datos.imagen_url || null,
      datos.nombre,
      datos.descripcion,
      datos.precio,
      datos.stock,
      datos.id_subcategoria,
      datos.id_marca,
    ],
  );
  console.log(filaAfectada);

  if (!filaAfectada) {
    throw Error("Algo pasó en la base de datos");
  }

  return;
};

export const editarProducto = async (id: number, datos: ProductoDTO) => {
  const { rowCount: filasEncontradas } = await db.query(
    `
    SELECT id
    FROM productos
    WHERE activo = $1 AND nombre = $2 AND id <> $3
    `,
    [true, datos.nombre, id],
  );
  console.log(filasEncontradas);

  if (filasEncontradas && filasEncontradas > 0) {
    throw Error("Ya existe ese producto");
  }

  const { rowCount: filaAfectada } = await db.query(
    `
    UPDATE productos SET
      imagen_url = $1,
      nombre = $2,
      descripcion = $3,
      precio = $4,
      stock = $5,
      id_subcategoria = $6,
      id_marca = $7
    WHERE
      id = $8
    `,
    [
      datos.imagen_url || null,
      datos.nombre,
      datos.descripcion,
      datos.precio,
      datos.stock,
      datos.id_subcategoria,
      datos.id_marca,
      id,
    ],
  );
  console.log(filaAfectada);

  if (!filaAfectada) {
    throw Error("Algo pasó en la base de datos");
  }

  return;
};

export const eliminarProducto = async (id: number) => {
  const { rowCount: filaAfectada } = await db.query(
    `
    UPDATE productos SET
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

export const ServicioProductos = {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  editarProducto,
  eliminarProducto,
};
