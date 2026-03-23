import { db } from "@/config/db.js";

export const obtenerNegocio = async (id: number) => {
    const consulta = await db.query(
        `
    SELECT * FROM negocio WHERE id = $1
    `,
        [id],
    );

    return consulta.rows;
};

export const ServicioNegocio = {
    obtenerNegocio,
}