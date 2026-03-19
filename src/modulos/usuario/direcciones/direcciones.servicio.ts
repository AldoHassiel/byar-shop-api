import { db } from "@/config/db.js";
import type { DireccionDTO } from "./direcciones.esquema.js";

const obtenerDirecciones = async (id: number) => {
  const consulta = await db.query(
    `SELECT id, calle, numero_exterior, numero_interior, colonia,ciudad, municipio, estado, codigo_postal, especificaciones, es_predeterminada
    FROM direcciones
    WHERE activo = $1 AND id_usuario = $2
    ORDER BY es_predeterminada DESC
    `,
    [true, id],
  );

  return consulta.rows;
};

const obtenerDireccion = async (id: number, idUsuario: number) => {
  const consulta = await db.query(
    `SELECT id, calle, numero_exterior, numero_interior, colonia,ciudad, municipio, estado, codigo_postal, especificaciones, es_predeterminada
    FROM direcciones
    WHERE activo = $1 AND id = $2 AND id_usuario = $3`,
    [true, id, idUsuario],
  );

  return consulta.rows;
};

const crearDireccion = async (id: number, datos: DireccionDTO) => {
  const consulta = await db.query(
    `
    SELECT id FROM direcciones
    WHERE activo = $1 AND id_usuario = $2
    `,
    [true, id],
  );

  const esPredeterminada = consulta.rowCount == 0;

  const { rowCount: filasAfectadas } = await db.query(
    `INSERT INTO direcciones
    (calle, numero_exterior, numero_interior, colonia, ciudad, municipio, estado, codigo_postal, especificaciones, id_usuario, es_predeterminada)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
    [
      datos.calle,
      datos.numero_exterior,
      datos.numero_interior,
      datos.colonia,
      datos.ciudad,
      datos.municipio,
      datos.estado,
      datos.codigo_postal,
      datos.especificaciones,
      id,
      esPredeterminada,
    ],
  );

  if (!filasAfectadas) {
    throw Error("No se pudo crear la dirección");
  }

  return;
};

const editarDireccion = async (
  idUsuario: number,
  id: number,
  datos: DireccionDTO,
) => {
  const { rowCount: filasAfectadas } = await db.query(
    `UPDATE direcciones SET
      calle = $1,
      numero_exterior = $2,
      numero_interior = $3,
      colonia = $4,
      ciudad = $5,
      municipio = $6,
      estado = $7,
      codigo_postal = $8,
      especificaciones = $9
    WHERE id_usuario = $10 AND id = $11`,
    [
      datos.calle,
      datos.numero_exterior,
      datos.numero_interior,
      datos.colonia,
      datos.ciudad,
      datos.municipio,
      datos.estado,
      datos.codigo_postal,
      datos.especificaciones,
      idUsuario,
      id,
    ],
  );

  if (!filasAfectadas) {
    throw Error("No se pudo editar la dirección");
  }

  return;
};

const establecerPredeterminada = async (idUsuario: number, id: number) => {
  const { rowCount: filasAfectadas1 } = await db.query(
    `
    UPDATE direcciones SET
      es_predeterminada = $1
    WHERE id_usuario = $2`,
    [false, idUsuario],
  );

  if (!filasAfectadas1) {
    throw Error("No se pudo establecer como predeterminada la dirección");
  }

  const { rowCount: filasAfectadas2 } = await db.query(
    `
    UPDATE direcciones SET
      es_predeterminada = $1
    WHERE id_usuario = $2 AND id = $3`,
    [true, idUsuario, id],
  );

  if (!filasAfectadas2) {
    throw Error("No se pudo establecer como predeterminada la dirección");
  }

  return;
};

const eliminarDireccion = async (idUsuario: number, id: number) => {
  const consulta = await db.query(
    `SELECT activo FROM direcciones WHERE id_usuario = $1 AND id = $2`,
    [idUsuario, id],
  );

  if (!consulta.rowCount) {
    throw Error("No se pudo eliminar la dirección");
  }

  if (consulta.rows[0].activo) {
    const consultaIndice = await db.query(
      `
        SELECT id FROM direcciones
        WHERE id_usuario = $1 AND activo = $2
        ORDER BY id ASC
        LIMIT 1
        `,
      [idUsuario, true],
    );

    if (consultaIndice.rowCount && consultaIndice.rowCount > 0) {
      await establecerPredeterminada(idUsuario, consultaIndice.rows[0].id);
    }
  }

  const { rowCount: filasAfectadas } = await db.query(
    `
    UPDATE direcciones SET
      activo = $1
    WHERE id_usuario = $2 AND id = $3`,
    [false, idUsuario, id],
  );

  if (!filasAfectadas) {
    throw Error("No se pudo eliminar la dirección");
  }

  return;
};

export const ServicioDirecciones = {
  obtenerDirecciones,
  obtenerDireccion,
  crearDireccion,
  editarDireccion,
  establecerPredeterminada,
  eliminarDireccion,
};
