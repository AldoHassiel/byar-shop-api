import { db } from "@/config/db.js";
import type { NegocioDTO } from "./negocio.esquema.js";
import { eliminarImagen } from "@/supabase/supabase.js";

export const obtenerNegocio = async () => {
  const consulta = await db.query(
    `
    SELECT * FROM negocio
    `,
  );

  return consulta.rows;
};

export const editarNegocio = async (datos: NegocioDTO) => {
  const consultaTraerImagen = await db.query(`
    SELECT imagen_sobre_de_url, hero_imagen_url FROM negocio WHERE id = 1;
    `);

  if (
    datos.accion_imagen_sobre_de === "nueva" ||
    datos.accion_imagen_sobre_de === "eliminar"
  ) {
    const imagen_actual =
      consultaTraerImagen.rows[0]?.imagen_sobre_de_url ?? "";

    if (imagen_actual) {
      try {
        await eliminarImagen(imagen_actual);
      } catch (errorStorage) {
        console.error(
          "No se pudo eliminar la imagen del negocio que estaba anteriormente:",
          errorStorage,
        );
      }
    }
  }

  if (
    datos.accion_imagen_hero === "nueva" ||
    datos.accion_imagen_hero === "eliminar"
  ) {
    const imagen_actual = consultaTraerImagen.rows[0]?.hero_imagen_url ?? "";

    if (imagen_actual) {
      try {
        await eliminarImagen(imagen_actual);
      } catch (errorStorage) {
        console.error(
          "No se pudo eliminar la imagen del negocio que estaba anteriormente:",
          errorStorage,
        );
      }
    }
  }

  const consutaActualizar = await db.query(
    `
    UPDATE negocio SET
      imagen_sobre_de_url = CASE
                              WHEN $1 = 'conservar' THEN imagen_sobre_de_url
                              WHEN $1 = 'nueva'     THEN $2
                              WHEN $1 = 'eliminar'  THEN NULL
                            END,
      hero_imagen_url     = CASE
                              WHEN $3 = 'conservar' THEN hero_imagen_url
                              WHEN $3 = 'nueva'     THEN $4
                              WHEN $3 = 'eliminar'  THEN NULL
                            END,
      nombre              = $5,
      descripcion         = $6,
      sobre_de            = $7,
      instagram           = $8,
      direccion           = $9,
      dias_laborales      = $10,
      hora_de_apertura    = $11,
      hora_de_cierre      = $12,
      hero_titulo         = $13,
      hero_descripcion    = $14
    WHERE id = 1
    `,
    [
      datos.accion_imagen_sobre_de,
      datos.imagen_sobre_de_url ?? null,
      datos.accion_imagen_hero,
      datos.hero_imagen_url ?? null,
      datos.nombre,
      datos.descripcion ?? null,
      datos.sobre_de ?? null,
      datos.instagram ?? null,
      datos.direccion ?? null,
      datos.dias_laborales ?? null,
      datos.hora_de_apertura ?? null,
      datos.hora_de_cierre ?? null,
      datos.hero_titulo ?? null,
      datos.hero_descripcion ?? null,
    ],
  );

  if (!consutaActualizar.rowCount) {
    throw Error("Algo pasó en la base de datos");
  }

  return;
};

export const ServicioNegocio = {
  obtenerNegocio,
  editarNegocio,
};
