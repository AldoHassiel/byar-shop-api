import { db } from "@/config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRETO_JWT } from "@/config/global.js";
import { SAL_JWT } from "@/config/global.js";
import {
  type RegistroDTO,
  type InicioSesionDTO,
} from "./autenticacion.esquema.js";
import type { UsuarioBaseDTO } from "./autenticacion.modelo.js";

const generarToken = (usuario: UsuarioBaseDTO): string => {
  if (!SECRETO_JWT)
    throw new Error("SECRETO_JWT no está definido en las variables de entorno");

  return jwt.sign(
    {
      id: usuario.id,
      correo: usuario.correo,
      es_admin: usuario.es_admin,
    },
    SECRETO_JWT,
    { expiresIn: "7d" },
  );
};

const registrar = async (datosUsuario: RegistroDTO) => {
  const { nombre, apellidos, telefono, correo, pwd } = datosUsuario;

  const { rows: existentes } = await db.query(
    "SELECT id FROM usuarios WHERE correo = $1",
    [correo],
  );

  if (existentes.length > 0) {
    throw new Error("El correo ya está registrado");
  }

  const sal = await bcrypt.genSalt(SAL_JWT);
  const pwdEncriptado = await bcrypt.hash(pwd, sal);

  const { rows } = await db.query(
    `INSERT INTO usuarios(nombre, apellidos, telefono, correo, pwd)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, nombre, apellidos, correo, es_admin`,
    [nombre, apellidos ?? null, telefono ?? null, correo, pwdEncriptado],
  );

  const usuario = rows[0];
  const token = generarToken(usuario);

  return { token, usuario };
};

const iniciarSesion = async (datos: InicioSesionDTO) => {
  const { correo, pwd } = datos;

  const { rows } = await db.query(
    `SELECT id, nombre, apellidos, telefono, correo, pwd, es_admin
    FROM usuarios
    WHERE correo = $1`,
    [correo],
  );

  if (rows.length === 0) {
    throw new Error("Correo o contraseña incorrectos");
  }

  const usuarioEncontrado = rows[0];

  const esPwdValido = await bcrypt.compare(pwd, usuarioEncontrado.pwd);

  if (!esPwdValido) {
    throw new Error("Correo o contraseña incorrectos");
  }

  const { pwd: _, ...usuario } = usuarioEncontrado;
  const token = generarToken(usuario);

  return { token, usuario };
};

export const ServicioAutenticacion = {
  registrar,
  iniciarSesion,
};
