import { db } from "@/config/db.js";

const obtenerEstadisticas = async () => {
  const resultado = await db.query("SELECT * FROM obtener_estadisticas()");

  return resultado.rows[0].obtener_estadisticas;
};

export const ServicioEstadisticas = {
  obtenerEstadisticas,
};
