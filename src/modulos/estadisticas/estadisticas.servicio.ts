import { db } from "@/config/db.js";

const obtenerEstadisticas = async () => {
  const resultado = await db.query("SELECT * FROM obtener_estadisticas()");

  return resultado.rows;
};

export const ServicioEstadisticas = {
  obtenerEstadisticas,
};
