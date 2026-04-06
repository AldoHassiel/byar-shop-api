import { db } from "@/config/db.js";

const obtenerCompras = async (id_usuario: number) => {
  const query = `
    SELECT
      p.id,
      ep.nombre AS estado,
      TO_CHAR(p.fecha_entrega_estimada, 'DD/MM/YYYY') AS fecha_entrega_estimada,
      TO_CHAR(p.fecha_entrego, 'DD/MM/YYYY') AS fecha_entregado,
      p.total,
      (array_agg(pr.imagen_url) FILTER (WHERE pr.imagen_url IS NOT NULL AND pr.imagen_url <> ''))[1:2] AS imagenes
    FROM pedidos p
    INNER JOIN estados_pedido ep ON ep.id = p.id_estado
    INNER JOIN detalle_pedido dp ON dp.id_pedido = p.id
    INNER JOIN productos pr ON pr.id = dp.id_producto
    WHERE p.id_usuario = $1
    GROUP BY p.id, ep.nombre, p.fecha_entrega_estimada, p.fecha_entrego, p.total
    ORDER BY p.fecha DESC;
  `;

  const consulta = await db.query(query, [id_usuario]);

  return consulta.rows;
};

const obtenerDetalleCompra = async (id_usuario: number, id_compra: number) => {
  const queryGenral = `
    SELECT
      p.id,
      TO_CHAR(p.fecha, 'DD/MM/YYYY') AS fecha,
      p.subtotal,
      p.costo_envio,
      p.total,
      TO_CHAR(p.fecha_entrega_estimada, 'DD/MM/YYYY') AS fecha_entrega_estimada,
      TO_CHAR(p.fecha_entrego, 'DD/MM/YYYY') AS fecha_entregado,
      ep.nombre AS estado,
      mp.marca AS tarjeta_marca,
      mp.ultimos_digitos AS tarjeta_ultimos_digitos,
      d.calle AS direccion_calle,
      d.numero_exterior AS direccion_numero_exterior,
      d.numero_interior AS direccion_numero_interior,
      d.colonia AS direccion_colonia,
      d.municipio AS direccion_municipio,
      d.estado AS direccion_estado,
      d.codigo_postal AS direccion_codigo_postal,
      d.pais AS direccion_pais,
      d.especificaciones AS direccion_especificaciones
    FROM pedidos p
    INNER JOIN estados_pedido ep ON ep.id = p.id_estado
    INNER JOIN metodos_de_pago mp ON mp.id = p.id_metodo_de_pago
    INNER JOIN direcciones d ON d.id = p.id_direccion
    WHERE p.id = $1 AND p.id_usuario = $2;
  `;

  const queryProductos = `
    SELECT
      p.id,
      p.nombre,
      p.descripcion,
      p.imagen_url,
      m.nombre AS marca,
      dp.cantidad,
      dp.precio,
      dp.subtotal
    FROM detalle_pedido dp
    INNER JOIN productos p
    ON p.id = dp.id_producto
    INNER JOIN marcas m
    ON m.id  = p.id_marca
    WHERE dp.id_pedido = $1;
  `;

  const [resultadoGeneral, resultadoProductos] = await Promise.all([
    db.query(queryGenral, [id_compra, id_usuario]),
    db.query(queryProductos, [id_compra]),
  ]);

  const pedido = resultadoGeneral.rows[0];
  const productos = resultadoProductos.rows;

  return { pedido, productos };
};

export const ServicioCompras = {
  obtenerCompras,
  obtenerDetalleCompra,
};
