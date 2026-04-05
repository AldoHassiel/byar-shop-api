import { db } from "@/config/db.js";

const obtenerCarrito = async (
  id_usuario: number,
  id_direccion: number | null = null,
) => {
  const productos = await obtenerProductos(id_usuario);
  const resumen = await obtenerResumen(id_usuario, id_direccion);

  return { productos, resumen };
};

const agregarProducto = async (
  id_usuario: number,
  id_producto: number,
  cantidad: number,
) => {
  const consultaProducto = `
     SELECT id, nombre, stock
     FROM productos
     WHERE id = $1
   `;
  const resultadoProducto = await db.query(consultaProducto, [id_producto]);

  if (resultadoProducto.rowCount === 0) {
    throw new Error("El producto no existe");
  }

  const producto = resultadoProducto.rows[0];

  const consultaExistente = `
      SELECT cantidad
      FROM carrito
      WHERE id_usuario = $1 AND id_producto = $2
    `;

  const resultadoExistente = await db.query(consultaExistente, [
    id_usuario,
    id_producto,
  ]);

  const cantidadActual =
    (resultadoExistente.rowCount ?? 0) > 0
      ? resultadoExistente.rows[0].cantidad
      : 0;

  const cantidadFinal = cantidadActual + cantidad;

  if (cantidadFinal > producto.stock) {
    throw new Error("Stock insuficiente");
  }

  const consultaUpsert = `
      INSERT INTO carrito (id_usuario, id_producto, cantidad)
      VALUES ($1, $2, $3)
      ON CONFLICT (id_usuario, id_producto)
      DO UPDATE SET cantidad = carrito.cantidad + EXCLUDED.cantidad
      RETURNING id_usuario, id_producto, cantidad
    `;
  await db.query(consultaUpsert, [id_usuario, id_producto, cantidad]);

  const esActualizacion = cantidadActual > 0;

  return {
    mensaje: esActualizacion
      ? `Cantidad actualizada en el carrito`
      : `${producto.nombre} agregado al carrito`,
  };
};

const actualizarProducto = async (
  id_usuario: number,
  id_producto: number,
  delta: number,
) => {
  const consultaProducto = `
      SELECT c.cantidad, p.stock, p.nombre
      FROM carrito c
      INNER JOIN productos p ON p.id = c.id_producto
      WHERE c.id_usuario  = $1
        AND c.id_producto = $2
    `;
  const resultadoProducto = await db.query(consultaProducto, [
    id_usuario,
    id_producto,
  ]);

  const { cantidad, stock } = resultadoProducto.rows[0];
  const cantidadNueva = cantidad + delta;

  if (cantidadNueva <= 0) {
    return await eliminarProducto(id_usuario, id_producto);
  }

  if (delta > 0 && cantidadNueva > stock) {
    throw new Error("Stock insuficiente");
  }

  await db.query(
    "UPDATE carrito SET cantidad = $1 WHERE id_usuario = $2 AND id_producto = $3",
    [cantidadNueva, id_usuario, id_producto],
  );
};

const eliminarProducto = async (id_usuario: number, id_producto: number) => {
  const query = `DELETE FROM carrito WHERE id_usuario = $1 AND id_producto = $2`;

  await db.query(query, [id_usuario, id_producto]);
};

const obtenerProductos = async (id_usuario: number) => {
  const consulta = await db.query(
    `
    SELECT
      p.id,
      p.imagen_url AS imagen_url,
      p.nombre AS nombre,
      m.nombre AS marca,
      p.stock AS stock,
      c.cantidad,
      p.precio * c.cantidad AS total,
      p.id_subcategoria AS id_subcategoria,
      c.id AS id_categoria,
      p.id_marca AS id_marca
    FROM carrito c
    INNER JOIN productos p
    ON p.id = c.id_producto
    INNER JOIN subcategorias s
    ON s.id = p.id_subcategoria
    INNER JOIN categorias ca
    ON ca.id = s.id_categoria
    INNER JOIN marcas m
    ON m.id = p.id_marca
    WHERE c.id_usuario = $1
    `,
    [id_usuario],
  );

  return consulta.rows;
};

const obtenerResumen = async (
  id_usuario: number,
  id_direccion: number | null = null,
) => {
  if (!id_direccion) {
    const consulta = await db.query(
      `
      SELECT
        SUM(p.precio * c.cantidad) AS subtotal,
        NULL AS costo_de_envio,
        SUM(p.precio * cantidad) AS total
      FROM carrito c
      INNER JOIN productos p
      ON p.id = c.id_producto
      WHERE c.id_usuario = $1
      `,
      [id_usuario],
    );

    return consulta.rows[0] ?? null;
  }

  const consulta = await db.query(
    `
    SELECT
      SUM(p.precio * c.cantidad) AS subtotal,
      e.costo AS costo_de_envio,
      SUM(p.precio * c.cantidad) + e.costo AS total
    FROM carrito c
    INNER JOIN usuarios u
    ON u.id = c.id_usuario
    INNER JOIN productos p
    ON p.id = c.id_producto
    INNER JOIN direcciones d
    ON d.id_usuario = c.id_usuario
    INNER JOIN costos_envio e
    ON e.estado LIKE d.estado
    WHERE c.id_usuario = $1
    AND d.id = $2
    GROUP BY u.nombre, d.estado, e.costo
    `,
    [id_usuario, id_direccion],
  );

  return consulta.rows[0] ?? null;
};

export const ServicioCarrito = {
  obtenerCarrito,
  agregarProducto,
  actualizarProducto,
  eliminarProducto,
};
