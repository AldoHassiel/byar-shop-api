import { db } from "@/config/db.js";
import { respuestaError, respuestaOk } from "@/utilidades/respuesta.js";
import { Router } from "express";

const rutasEstadosPedidos = Router();

rutasEstadosPedidos.get("/estadosPedidos", async (_, res) => {
  try {
    const { rows } = await db.query("SELECT id, nombre FROM estados_pedido");
    return respuestaOk(res, "Estados de los pedidos obtenidos con éxito", rows);
  } catch (error) {
    console.log(error);
    return respuestaError(res, "Error interno del servidor");
  }
});

export default rutasEstadosPedidos;
