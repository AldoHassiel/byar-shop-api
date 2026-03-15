import { Router } from "express";
import { db } from "@/config/db.js";

const enrutador = Router();

enrutador.get("/", (_, res) => {
  res.send("<h1>Hola mundo</h1>");
});

enrutador.get("/ping", async (_, res) => {
  const resultado = await db.query("SELECT NOW()");
  return res.send(`<p>${resultado.rows[0].now}<p>`);
});

export default enrutador;
