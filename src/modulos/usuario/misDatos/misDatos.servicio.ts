import { db } from "@/config/db.js";
import type {
  MisDatosEditarCorreoDTO,
  MisDatosEditarDTO,
  MisDatosEditarPwdDTO,
} from "./misDatos.esquema.js";
import bcrypt from "bcrypt";
import { SAL } from "@/config/global.js";

const obtener = async (idUsuario: number) => {
  const consulta = await db.query(
    `
    SELECT nombre, apellidos, telefono, correo
    FROM usuarios
    WHERE id = $1 AND activo = TRUE
    `,
    [idUsuario],
  );

  return consulta.rows;
};

const editarDatosGenerales = async (
  idUsuario: number,
  datos: MisDatosEditarDTO,
) => {
  const { nombre, apellidos, telefono } = datos;

  const consulta = await db.query(
    `
    UPDATE usuarios SET
      nombre = $1,
      apellidos = $2,
      telefono = $3
    WHERE id = $4 AND activo = TRUE
    `,
    [nombre, apellidos, telefono, idUsuario],
  );

  if (!consulta.rowCount) {
    throw Error("No se pudo editar los datos");
  }

  return;
};

const editarCorreo = async (
  idUsuario: number,
  datos: MisDatosEditarCorreoDTO,
) => {
  const { correo } = datos;

  const consultaId = await db.query(
    `
      SELECT id FROM usuarios
      WHERE correo = $1 AND id <> $2
    `,
    [correo, idUsuario],
  );

  if (consultaId.rowCount && consultaId.rowCount > 0) {
    new Error("Ese correo ya existe");
  }

  const consultaActualizar = await db.query(
    `
    UPDATE usuarios SET
      correo = $1
    WHERE id = $2 AND activo = TRUE
    `,
    [correo, idUsuario],
  );

  if (!consultaActualizar.rowCount) {
    throw Error("No se pudo editar el correo");
  }

  return;
};

const editarPwd = async (idUsuario: number, datos: MisDatosEditarPwdDTO) => {
  const { pwd } = datos;

  const sal = await bcrypt.genSalt(SAL);
  const pwdEncriptado = await bcrypt.hash(pwd, sal);

  const consulta = await db.query(
    `
    UPDATE usuarios SET
      pwd = $1
    WHERE id = $2
    `,
    [pwdEncriptado, idUsuario],
  );

  if (!consulta.rowCount) {
    throw Error("No se pudo editar la contraseña");
  }

  return;
};

export const ServicioMisDatos = {
  obtener,
  editarDatosGenerales,
  editarCorreo,
  editarPwd,
};
