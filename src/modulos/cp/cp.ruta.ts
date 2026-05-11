import { db } from "@/config/db.js";
import { respuestaError, respuestaOk } from "@/utilidades/respuesta.js";
import { Router } from "express";

const rutasCP = Router();

rutasCP.get("/cp/:cp", async (req, res) => {
  try {
    const codigo_postal = req.params.cp;

    const query = `
        SELECT
          ARRAY_AGG(DISTINCT d_estado ORDER BY d_estado) AS estados,
          ARRAY_AGG(DISTINCT d_mnpio ORDER BY d_mnpio) AS municipios,
          ARRAY_AGG(DISTINCT d_ciudad ORDER BY d_ciudad) FILTER (WHERE d_ciudad IS NOT NULL AND d_ciudad <> '') AS ciudades,
          ARRAY_AGG(DISTINCT d_asenta ORDER BY d_asenta) AS colonias
        FROM codigos_postales
        WHERE d_codigo = $1;
      `;

    const { rows } = await db.query(query, [codigo_postal]);

    respuestaOk(res, "Datos del codigo postal obtenidos con exito", [
      {
        estados: rows[0].estados || [],
        municipios: rows[0].municipios || [],
        ciudades: rows[0].ciudades || [],
        colonias: rows[0].colonias || [],
      },
    ]);
  } catch (error) {
    console.log(error);
    return respuestaError(res, "Error interno del servidor");
  }
});

export default rutasCP;
