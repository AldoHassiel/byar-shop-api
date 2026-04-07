import { db } from "@/config/db.js";
import type { FiltrosPedidoDTO } from "./pedidos.esquema.js";

const obtenerPedidos = async (datos: FiltrosPedidoDTO) => {
  const consulta = await db.query(
    `SELECT * FROM obtener_pedidos($1, $2, $3, $4, $5, $6, $7)`,
    [
      datos.id_pedido || null,
      datos.nombre_usuario || null,
      datos.direccion || null,
      datos.id_estado || 0,
      datos.fecha_inicio || null,
      datos.fecha_fin || null,
      datos.periodo_dias || null,
    ],
  );

  return consulta.rows;
};

const obtenerPedido = async (id_pedido: number) => {
  const queryGeneral = `
    SELECT
      p.id,
      TO_CHAR(p.fecha, 'DD/MM/YYYY') AS fecha,
      p.subtotal,
      p.costo_envio,
      p.total,
      TO_CHAR(p.fecha_entrega_estimada, 'DD/MM/YYYY') AS fecha_entrega_estimada,
      TO_CHAR(p.fecha_entrego, 'DD/MM/YYYY') AS fecha_entregado,
      ep.nombre AS estado,
      u.nombre AS usuario_nombre,
      u.apellidos AS usuario_apellidos,
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
    INNER JOIN usuarios u ON u.id = p.id_usuario
    WHERE p.id = $1;
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
    db.query(queryGeneral, [id_pedido]),
    db.query(queryProductos, [id_pedido]),
  ]);

  const pedido = resultadoGeneral.rows[0];
  const productos = resultadoProductos.rows;

  return { pedido, productos };
};

const cambiarEstado = async (id_pedido: number, id_estado: number) => {
  await db.query(
    `
    UPDATE pedidos SET
      id_estado = $1,
      fecha_entrego = NOW()
    WHERE id = $2
    `,
    [id_estado, id_pedido],
  );

  return;
};

export const ServicioPedidos = {
  obtenerPedidos,
  obtenerPedido,
  cambiarEstado,
};
