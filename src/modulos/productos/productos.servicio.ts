import { db } from "@/config/db.js";
import type {
  FiltrosProductoDTO,
  ProductoDTO,
  ProductoEditadoDTO,
} from "./productos.esquema.js";
import { eliminarImagen } from "@/supabase/supabase.js";

export const obtenerProductos = async (filtros: FiltrosProductoDTO, usuarioId: number | null) => {
  const consulta = await db.query(
    `
    SELECT * FROM obtener_productos($1, $2, $3, $4, $5, $6, $7, $8, $9)
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
      usuarioId || null,
    ],
  );

  return consulta.rows;
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
      datos.imagen_url,
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

export const editarProducto = async (id: number, datos: ProductoEditadoDTO) => {
  const { rowCount: filasEncontradas } = await db.query(
    `
    SELECT id
    FROM productos
    WHERE activo = $1 AND nombre = $2 AND id <> $3
    `,
    [true, datos.nombre, id],
  );

  if (filasEncontradas && filasEncontradas > 0) {
    throw Error("Ya existe ese producto");
  }

  if (datos.accion_imagen === "nueva" || datos.accion_imagen === "eliminar") {
    const { rows } = await db.query(
      `SELECT imagen_url FROM productos WHERE id = $1`,
      [id],
    );

    const imagenUrlActual: string | null = rows[0]?.imagen_url ?? null;

    if (imagenUrlActual) {
      try {
        await eliminarImagen(imagenUrlActual);
      } catch (errorStorage) {
        console.error("No se pudo eliminar la imagen anterior:", errorStorage);
      }
    }
  }

  const { rowCount: filaAfectada } = await db.query(
    `
    UPDATE productos SET
      imagen_url      = CASE
                          WHEN $1 = 'conservar' THEN imagen_url
                          WHEN $1 = 'nueva'     THEN $2
                          WHEN $1 = 'eliminar'  THEN NULL
                        END,
      nombre          = $3,
      descripcion     = $4,
      precio          = $5,
      stock           = $6,
      id_subcategoria = $7,
      id_marca        = $8
    WHERE id = $9
    `,
    [
      datos.accion_imagen,
      datos.imagen_url ?? null,
      datos.nombre,
      datos.descripcion,
      datos.precio,
      datos.stock,
      datos.id_subcategoria,
      datos.id_marca,
      id,
    ],
  );

  if (!filaAfectada) {
    throw Error("Algo pasó en la base de datos");
  }

  return;
};

export const eliminarProducto = async (id: number) => {
  const { rows } = await db.query(
    `
    SELECT imagen_url
    FROM productos
    WHERE id = $1
    `,
    [id],
  );

  if (!rows.length) {
    throw Error("Producto no encontrado");
  }

  const imagenUrl: string | null = rows[0]?.imagen_url ?? null;

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

  if (imagenUrl) {
    try {
      await eliminarImagen(imagenUrl);
    } catch (errorStorage) {
      console.error("No se pudo eliminar la imagen del storage:", errorStorage);
    }
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
