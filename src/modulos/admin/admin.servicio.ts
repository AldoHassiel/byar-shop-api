import { db } from "@/config/db.js";
import bcrypt from "bcrypt";
import { SAL } from "@/config/global.js";
import { type RegistroDTO } from "@/modulos/autenticacion/autenticacion.esquema.js";

const crearAdmin = async (datos: RegistroDTO) => {
  const { nombre, apellidos, telefono, correo, pwd } = datos;

  const { rows: existentes } = await db.query(
    "SELECT id, pwd FROM usuarios WHERE correo = $1",
    [correo],
  );

  if (existentes.length > 0) {
    const esPwdValido = await bcrypt.compare(pwd, existentes[0].pwd);

    if (!esPwdValido) {
      throw new Error("El correo ya está registrado");
    }

    const { rows } = await db.query(
      `
      UPDATE usuarios SET activo = $1 WHERE id = $2
      RETURNING id, nombre, apellidos, telefono, correo, es_admin`,
      [true, existentes[0].id],
    );

    const admin = rows[0];

    return admin;
  }

  const sal = await bcrypt.genSalt(SAL);
  const pwdEncriptado = await bcrypt.hash(pwd, sal);

  const { rows } = await db.query(
    `INSERT INTO usuarios(nombre, apellidos, telefono, correo, pwd, es_admin)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, nombre, apellidos, telefono, correo`,
    [nombre, apellidos ?? null, telefono ?? null, correo, pwdEncriptado, true],
  );

  const { pwd: _, ...admin } = rows[0];

  return admin;
};

export const ServicoAdmin = {
  crearAdmin,
};
