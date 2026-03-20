import { db } from "@/config/db.js";
import type { MetodoPagoDTO } from "./metodosPago.esquema.js";

const obtenerMetodos = async (idUsuario: number) => {
  const consulta = await db.query(
    `
    SELECT id, ultimos_digitos, marca, es_predeterminada
   FROM metodos_de_pago
   WHERE activo = TRUE AND id_usuario = $1
   ORDER BY es_predeterminada DESC
    `,
    [idUsuario],
  );

  return consulta.rows;
};

const obtenerMetodo = async (idUsuario: number, id: number) => {
  const consulta = await db.query(
    `
    SELECT id, nombre_titular, ultimos_digitos, mes_vencimiento, ano_vencimiento, marca, es_predeterminada
   FROM metodos_de_pago
   WHERE activo = TRUE AND id_usuario = $1 AND id = $2
    `,
    [idUsuario, id],
  );

  return consulta.rows;
};

const crearMetodo = async (idUsuario: number, datos: MetodoPagoDTO) => {
  const consultaConteo = await db.query(
    `
    SELECT id FROM metodos_de_pago
    WHERE activo = TRUE AND id_usuario = $1
    `,
    [idUsuario],
  );

  const esPredeterminada = consultaConteo.rowCount == 0;
  const marca = detectarMarcaTarjeta(datos.numero_tarjeta);

  const consultaInsertar = await db.query(
    `
    INSERT INTO metodos_de_pago(nombre_titular, numero_tarjeta, ultimos_digitos, mes_vencimiento, ano_vencimiento, cvv, marca, es_predeterminada, id_usuario)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `,
    [
      datos.nombre_titular,
      datos.numero_tarjeta,
      datos.numero_tarjeta.slice(-4),
      datos.mes_vencimiento,
      datos.ano_vencimiento,
      datos.cvv,
      marca,
      esPredeterminada,
      idUsuario,
    ],
  );

  if (!consultaInsertar) {
    throw Error("No se pudo crear el método de pago");
  }

  return consultaInsertar.rows;
};

const establecerPredeterminada = async (idUsuario: number, id: number) => {
  const { rowCount: filasAfectadas1 } = await db.query(
    `
    UPDATE metodos_de_pago SET
      es_predeterminada = $1
    WHERE id_usuario = $2`,
    [false, idUsuario],
  );

  if (!filasAfectadas1) {
    throw Error("No se pudo establecer como predeterminada el método de pago");
  }

  const { rowCount: filasAfectadas2 } = await db.query(
    `
    UPDATE metodos_de_pago SET
      es_predeterminada = $1
    WHERE id_usuario = $2 AND id = $3`,
    [true, idUsuario, id],
  );

  if (!filasAfectadas2) {
    throw Error("No se pudo establecer como predeterminada el método de pago");
  }

  return;
};

const eliminarMetodo = async (idUsuario: number, id: number) => {
  const consulta = await db.query(
    `SELECT es_predeterminada FROM metodos_de_pago
     WHERE id_usuario = $1 AND id = $2 AND activo = true`,
    [idUsuario, id],
  );

  if (!consulta.rowCount) {
    throw new Error("No se pudo eliminar el método de pago");
  }

  const eraPredeterminada = consulta.rows[0].es_predeterminada;

  await db.query(
    `UPDATE metodos_de_pago SET
       activo = false,
       es_predeterminada = false
     WHERE id_usuario = $1 AND id = $2`,
    [idUsuario, id],
  );

  if (eraPredeterminada) {
    const siguiente = await db.query(
      `SELECT id FROM metodos_de_pago
       WHERE id_usuario = $1 AND activo = true
       ORDER BY id ASC
       LIMIT 1`,
      [idUsuario],
    );

    if (siguiente.rowCount) {
      await establecerPredeterminada(idUsuario, siguiente.rows[0].id);
    }
  }
};

function detectarMarcaTarjeta(numero: string) {
  const num = numero.replace(/\D/g, "");

  const marcas = [
    { nombre: "Visa", regex: /^4/ },
    {
      nombre: "Mastercard",
      regex: /^5[1-5]|^2(2[2-9][1-9]|[3-6]\d{2}|7([01]\d|20))/,
    },
    { nombre: "American Express", regex: /^3[47]/ },
    {
      nombre: "Discover",
      regex:
        /^6(?:011|22(?:1(?:2[6-9]|[3-9]\d)|[2-8]\d{2}|9(?:[01]\d|2[0-5]))|4[4-9]\d|5\d{2})/,
    },
    { nombre: "Diners Club", regex: /^3(?:0[0-5]|[68])/ },
    { nombre: "JCB", regex: /^(?:2131|1800|35\d{3})/ },
    { nombre: "UnionPay", regex: /^62/ },
    { nombre: "Maestro", regex: /^(?:5018|5020|5038|6304|6759|676[1-3])/ },
    {
      nombre: "Elo",
      regex:
        /^(?:4011|4312|4389|4514|4573|4576|5041|5066|5067|509\d|6277|6362|6363|650[0-5]|6516|6550)/,
    },
    { nombre: "Hipercard", regex: /^(?:38|60)/ },
    { nombre: "Mir", regex: /^220[0-4]/ },
    { nombre: "RuPay", regex: /^60(?:80|81|82|84|85)/ },
  ];

  const encontrada = marcas.find(({ regex }) => regex.test(num));
  return encontrada ? encontrada.nombre : "Desconocida";
}

export const ServicioMetodosPagos = {
  obtenerMetodos,
  obtenerMetodo,
  crearMetodo,
  establecerPredeterminada,
  eliminarMetodo,
};
