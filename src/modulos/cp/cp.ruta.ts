import { respuestaError, respuestaOk } from "@/utilidades/respuesta.js";
import { Router } from "express";

const rutasCP = Router();

rutasCP.get("/cp/:cp", async (req, res) => {
  try {
    const consulta = await fetch(
      `https://sepomex.icalialabs.com/api/v1/zip_codes?zip_code=${req.params.cp}`,
    );

    const { zip_codes } = await consulta.json();

    const cosas = zip_codes.map(
      (dato: {
        d_asenta: string;
        d_mnpio: string;
        d_estado: string;
        d_ciudad: string;
      }) => {
        return {
          colonia: dato.d_asenta,
          municipio: dato.d_mnpio,
          estado: dato.d_estado,
          ciudad: dato.d_ciudad,
        };
      },
    );

    return respuestaOk(
      res,
      "Datos del codigo postal obtenidos con exito",
      cosas,
    );
  } catch (error) {
    console.log(error);
    return respuestaError(res, "Error interno del servidor");
  }
});

export default rutasCP;
