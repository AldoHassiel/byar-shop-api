import {
  respuestaError,
  respuestaErrorValidacion,
  respuestaOk,
} from "@/utilidades/respuesta.js";
import type { Request, Response } from "express";
import { ServicioMisDatos } from "./misDatos.servicio.js";
import {
  esquemaEditarCorreo,
  esquemaEditarMisDatos,
  esquemaEditarPwd,
} from "./misDatos.esquema.js";

const esProduccion = process.env.NODE_ENV === "production";

const obtenerDatos = async (req: Request, res: Response) => {
  if (!req.usuario?.id) {
    return respuestaError(res, "Hace falta el id en el token", 400);
  }

  try {
    const datos = await ServicioMisDatos.obtener(req.usuario?.id);
    return respuestaOk(res, "Datos obtenidos éxitosamente", datos);
  } catch (error) {
    const mensaje = (error as Error).message;
    console.log(error);
    return respuestaError(res, "Error interno del servidor");
  }
};

const editarDatosGenerales = async (req: Request, res: Response) => {
  const datosGenerales = esquemaEditarMisDatos.safeParse(req.body);

  if (!datosGenerales.success) {
    return respuestaErrorValidacion(res, datosGenerales.error);
  }

  if (!req.usuario?.id) {
    return respuestaError(res, "Hace falta el id en el token", 400);
  }

  try {
    await ServicioMisDatos.editarDatosGenerales(
      req.usuario?.id,
      datosGenerales.data,
    );
    return respuestaOk(res, "Datos editados éxitosamente");
  } catch (error) {
    console.log(error);
    const mensaje = (error as Error).message;

    if (mensaje == "Ese correo ya existe") {
      return respuestaError(res, "Ese correo ya existe", 409);
    }

    if (mensaje == "No se pudo editar los datos") {
      return respuestaError(res, "No se pudo editar los datos", 409);
    }

    return respuestaError(res, "Error interno del servidor");
  }
};

const editarCorreo = async (req: Request, res: Response) => {
  const correo = esquemaEditarCorreo.safeParse(req.body);

  if (!correo.success) {
    return respuestaErrorValidacion(res, correo.error);
  }

  if (!req.usuario?.id) {
    return respuestaError(res, "Hace falta el id en el token", 400);
  }

  try {
    await ServicioMisDatos.editarCorreo(req.usuario?.id, correo.data);
    return respuestaOk(res, "Correo editado éxitosamente");
  } catch (error) {
    console.log(error);
    const mensaje = (error as Error).message;

    if (mensaje == "Ese correo ya existe") {
      return respuestaError(res, "Ese correo ya existe", 409);
    }

    if (mensaje == "No se pudo editar el correo") {
      return respuestaError(res, "No se pudo editar el correo", 409);
    }

    return respuestaError(res, "Error interno del servidor");
  }
};

const editarPwd = async (req: Request, res: Response) => {
  const pwd = esquemaEditarPwd.safeParse(req.body);

  if (!pwd.success) {
    return respuestaErrorValidacion(res, pwd.error);
  }

  if (!req.usuario?.id) {
    return respuestaError(res, "Hace falta el id en el token", 400);
  }

  try {
    await ServicioMisDatos.editarPwd(req.usuario?.id, pwd.data);
    return respuestaOk(res, "Contraseña editada éxitosamente");
  } catch (error) {
    console.log(error);
    const mensaje = (error as Error).message;

    if (mensaje == "La contraseña actual no coincide con la registrada") {
      return respuestaError(res, mensaje, 409);
    }

    if (mensaje == "No se pudo editar la contraseña") {
      return respuestaError(res, "No se pudo editar la contraseña", 409);
    }

    return respuestaError(res, "Error interno del servidor");
  }
};

const eliminarCuenta = async (req: Request, res: Response) => {
  if (!req.usuario?.id) {
    return respuestaError(res, "Hace falta el id en el token", 400);
  }

  try {
    await ServicioMisDatos.eliminarCuenta(req.usuario?.id);

    res.clearCookie("token", {
      httpOnly: true,
      secure: esProduccion,
      sameSite: esProduccion ? "none" : "lax",
    });

    return respuestaOk(res, "Cuenta eliminada éxitosamente");
  } catch (error) {
    console.log(error);
    const mensaje = (error as Error).message;

    if (mensaje == "No se pudo eliminar la cuenta") {
      return respuestaError(res, mensaje, 409);
    }

    return respuestaError(res, "Error interno del servidor");
  }
};

export const ControladorMisDatos = {
  obtenerDatos,
  editarDatosGenerales,
  editarCorreo,
  editarPwd,
  eliminarCuenta,
};
