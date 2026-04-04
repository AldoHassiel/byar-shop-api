import { respuestaError, respuestaOk } from "@/utilidades/respuesta.js";
import { Router } from "express";

const rutasCP = Router();

rutasCP.get("/cp/:cp", async (req, res) => {
  try {
    const consulta = await fetch(
      `https://sepomex.icalialabs.com/api/v1/zip_codes?zip_code=${req.params.cp}`,
    );

    interface ZipCodes {
      d_estado: string;
      d_mnpio: string;
      d_ciudad: string;
      d_asenta: string;
    }

    const { zip_codes }: { zip_codes: ZipCodes[] } = await consulta.json();

    const obtenerValoresUnicos = (
      zip_codes: ZipCodes[],
      llave: keyof ZipCodes,
    ) => {
      const todosLosValores = zip_codes.map((dato) => dato[llave]);
      const sinDuplicados = new Set(todosLosValores);
      const comoArray = Array.from(sinDuplicados);
      return comoArray;
    };

    const estados = obtenerValoresUnicos(zip_codes, "d_estado");
    const municipios = obtenerValoresUnicos(zip_codes, "d_mnpio");
    const ciudades = obtenerValoresUnicos(zip_codes, "d_ciudad");
    const colonias = obtenerValoresUnicos(zip_codes, "d_asenta");

    const info = {
      estados,
      municipios,
      ciudades,
      colonias,
    };

    return respuestaOk(
      res,
      "Datos del codigo postal obtenidos con exito",
      [info],
    );
  } catch (error) {
    console.log(error);
    return respuestaError(res, "Error interno del servidor");
  }
});

export default rutasCP;
