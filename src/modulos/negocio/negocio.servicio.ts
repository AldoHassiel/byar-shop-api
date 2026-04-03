import { db } from "@/config/db.js";
import type { EditarNegocioServicio } from "./negocio.esquema.js";

export const obtenerNegocio = async () => {
  const consulta = await db.query(
    `
    SELECT * FROM negocio
    `,
  );

  return consulta.rows;
};

const editarNegocio = async (datos: EditarNegocioServicio) => {
  const datosFiltrados = Object.fromEntries(
    Object.entries(datos).filter(([_, v]) => v !== undefined),
  );

  const campos = Object.keys(datosFiltrados);
  const valores = Object.values(datosFiltrados);

  if (campos.length === 0) return;

  const set = campos.map((campo, i) => `${campo} = $${i + 1}`).join(", ");

  await db.query(`UPDATE negocio SET ${set} WHERE id = 1`, [...valores]);

  return;
};

export const ServicioNegocio = {
  obtenerNegocio,
  editarNegocio,
};
