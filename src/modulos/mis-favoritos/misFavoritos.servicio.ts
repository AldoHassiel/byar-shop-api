import { db } from "@/config/db.js";

const obtenerFavoritos = async (idUsuario: number) => {
    const resultado = await db.query(
        `
    SELECT
      p.id,
      p.imagen_url,
      p.nombre,
      p.descripcion
    FROM mis_favoritos mf
    INNER JOIN productos p
      ON p.id = mf.id_producto
    WHERE mf.id_usuario = $1
      AND p.activo = TRUE
    `,
        [idUsuario]
    );

    return resultado.rows;
};

const eliminarFavorito = async (idUsuario: number, idProducto: number) => {
    const resultado = await db.query(
        `DELETE FROM mis_favoritos 
     WHERE id_usuario = $1 AND id_producto = $2`,
        [idUsuario, idProducto]
    );

    if (!resultado.rowCount) {
        throw new Error("El favorito no existe");
    }
};

const agregarFavorito = async (idUsuario: number, idProducto: number) => {
    await db.query(
        `
    INSERT INTO mis_favoritos (id_usuario, id_producto)
    VALUES ($1, $2)
    ON CONFLICT (id_usuario, id_producto) DO NOTHING
    `,
        [idUsuario, idProducto]
    );
};

export const ServicioMisFavoritos = {
    obtenerFavoritos,
    eliminarFavorito,
    agregarFavorito,
};