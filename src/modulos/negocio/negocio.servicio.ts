import { db } from "@/config/db.js";

export const obtenerNegocio = async () => {
  const consulta = await db.query(
    `
    SELECT * FROM negocio
    `,
  );

  return consulta.rows;
};

export const ServicioNegocio = {
  obtenerNegocio,
};
